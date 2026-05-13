"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LinkIcon, BarChart3, Key, Settings, Shield, Users, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardNav() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  const navItems = [
    { href: "/dashboard", label: "URLs", icon: BarChart3 },
    { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const adminItems = [
    { href: "/admin", label: "Users", icon: Users },
    { href: "/admin/urls", label: "All URLs", icon: LinkIcon },
    { href: "/admin/api-keys", label: "All API Keys", icon: Shield },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <LinkIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">hrva.cc</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn("flex items-center gap-2", isActive && "bg-primary/10 text-primary")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              {isAdmin && (
                <div className="flex items-center space-x-1 ml-4 pl-4 border-l">
                  {adminItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className={cn("flex items-center gap-2", isActive && "bg-primary/10 text-primary")}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <span className="hidden md:block text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-around pb-2">
          {[...navItems, ...(isAdmin ? adminItems : [])].map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center py-1 px-3 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <Icon className="h-5 w-5 mb-1" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
