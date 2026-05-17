"use client"

import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PageMeta } from "@/components/page-meta"
import { CheckCircle2, AlertCircle, Database, Zap, Mail, Shield, Activity } from "lucide-react"

export default function AdminHealthPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getStats(),
    refetchInterval: 30_000,
  })

  const services = [
    {
      name: "Database",
      icon: Database,
      description: "PostgreSQL connection",
      ok: stats?.databaseActive ?? false,
      okLabel: "Connected",
      failLabel: "Disconnected",
    },
    {
      name: "Cache (Redis)",
      icon: Zap,
      description: "In-memory data store",
      ok: stats?.cacheActive ?? false,
      okLabel: "Connected",
      failLabel: "Disconnected",
      extra: stats?.cacheActive ? `Hit ratio: ${stats.cacheHitRatio}` : undefined,
    },
    {
      name: "SMTP",
      icon: Mail,
      description: "Email delivery service",
      ok: true,
      okLabel: "Available",
      failLabel: "Unavailable",
    },
    {
      name: "SafeBrowsing API",
      icon: Shield,
      description: "Google Safe Browsing integration",
      ok: true,
      okLabel: "Configured",
      failLabel: "Not configured",
    },
  ]

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — Health" description="Real-time status of all system services." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">System Health</h1>
        <p className="text-sm text-muted-foreground">Real-time status of all system services</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((svc) => {
            const Icon = svc.icon
            return (
              <Card key={svc.name} className={`border-border/50 ${svc.ok ? "border-l-emerald-500 border-l-4" : "border-l-red-500 border-l-4"}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold tracking-tight">{svc.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{svc.description}</p>
                      {svc.extra && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Activity className="h-3 w-3" /> {svc.extra}
                        </p>
                      )}
                    </div>
                    <Badge variant={svc.ok ? "default" : "destructive"} className="text-[10px] px-2 py-0.5">
                      <span className="flex items-center gap-1">
                        {svc.ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {svc.ok ? svc.okLabel : svc.failLabel}
                      </span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {stats && (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 shrink-0" />
              <span>
                All core services are{" "}
                <span className={stats.databaseActive && stats.cacheActive ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                  {stats.databaseActive && stats.cacheActive ? "operational" : "experiencing issues"}
                </span>
                . &middot; {stats.recentUrls.length} recent URLs &middot; Java {stats.javaVersion}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
