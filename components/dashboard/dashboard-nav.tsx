"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { BarChart3, Key, Settings, Users, LinkIcon, Shield, LogOut } from "lucide-react"
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
    <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Logo showText className="shrink-0" />

            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 gap-1.5 text-xs font-medium",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              {isAdmin && (
                <div className="flex items-center gap-0.5 ml-3 pl-3 border-l border-border/50">
                  {adminItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 gap-1.5 text-xs font-medium",
                            isActive
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden md:block text-xs text-muted-foreground max-w-[140px] truncate">
              {user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-start gap-1 pb-2 overflow-x-auto scrollbar-none">
          {[...navItems, ...(isAdmin ? adminItems : [])].map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}>
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
