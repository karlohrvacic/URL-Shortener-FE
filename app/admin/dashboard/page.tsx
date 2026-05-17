"use client"

import { useQuery } from "@tanstack/react-query"
import { adminApi } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageMeta } from "@/components/page-meta"
import { Users, LinkIcon, Shield, Activity, Clock, Database, HardDrive, Cpu, Server, AlertCircle, CheckCircle2, Zap, BarChart3, Layers, ShieldAlert } from "lucide-react"
import { formatDate, formatDateTime, formatShortUrl, truncateUrl, getApiBaseUrl } from "@/lib/utils"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getStats(),
    refetchInterval: 30_000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageMeta title="Admin Dashboard" description="System overview and statistics." />
        <h1 className="text-2xl font-display tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <PageMeta title="Admin Dashboard" />
        <h1 className="text-2xl font-display tracking-tight">Dashboard</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <p className="text-destructive">Failed to load stats</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const systemItems = [
    { icon: Server, label: "App Version", value: `v${stats.appVersion}` },
    { icon: Clock, label: "Uptime", value: stats.uptime },
    { icon: BarChart3, label: "Requests", value: stats.requestsCount.toLocaleString() },
    { icon: Cpu, label: "Java", value: stats.javaVersion },
    { icon: HardDrive, label: "Server Time", value: new Date(stats.serverTime).toLocaleString() },
  ]

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — Dashboard" description="System overview and statistics." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">System overview and statistics</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Total</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Users</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <LinkIcon className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Total</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.totalUrls.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">URLs</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Active</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.activeUrls.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">URLs</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Total</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.totalApiKeys.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">API Keys</p>
          </CardContent>
        </Card>
      </div>

      {/* Second row — metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Cache</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.cacheHitRatio}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Hit ratio</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">JVM Heap</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.jvmMemoryUsed}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {stats.jvmMemoryMax}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Redirect</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.redirectAvgMs ?? "—"}<span className="text-sm text-muted-foreground font-normal"> ms</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">avg · max {stats.redirectMaxMs ?? "—"}ms · {stats.redirectCount?.toLocaleString() ?? 0} redirects</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-[11px] text-muted-foreground tracking-wide uppercase">Profiles</span>
            </div>
            <p className="font-display text-2xl text-primary">{stats.activeProfiles.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stats.activeProfiles.join(", ") || "default"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* System info */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Database</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {stats.databaseActive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span className={cn("text-xs font-medium", stats.databaseActive ? "text-success" : "text-destructive")}>
                      {stats.databaseActive ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Cache (Redis)</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {stats.cacheActive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-foreground/40" />
                    )}
                    <span className={cn("text-xs font-medium", stats.cacheActive ? "text-success" : "text-foreground/40")}>
                      {stats.cacheActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              {systemItems.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-xs font-medium truncate mt-0.5">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limits */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Login Rate Limits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginRateLimits />
        </CardContent>
      </Card>

      {/* Recent URLs */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            Recent URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead>Long URL</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentUrls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell><span className="text-primary font-medium">/{url.shortUrl}</span></TableCell>
                  <TableCell className="max-w-[200px]"><span className="truncate block" title={url.longUrl}>{truncateUrl(url.longUrl, 40)}</span></TableCell>
                  <TableCell className="text-sm">{url.ownerEmail || "\u2014"}</TableCell>
                  <TableCell className="text-sm">{url.visits}</TableCell>
                  <TableCell className="text-sm text-muted-foreground" title={formatDateTime(url.createDate)}>{formatDate(url.createDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LoginRateLimits() {
  const { data: attempts, isLoading, refetch } = useQuery<Record<string, number>>({
    queryKey: ["admin", "login-attempts"],
    queryFn: () => adminApi.getLoginAttempts(),
    refetchInterval: 10_000,
  })

  const handleClear = async () => {
    try {
      await adminApi.clearLoginAttempts()
      toast.success("Rate limits cleared")
      refetch()
    } catch (err: any) {
      toast.error(err.message || "Failed to clear")
    }
  }

  const entries = attempts ? Object.entries(attempts) : []

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />
  }

  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No active rate limits</p>
      ) : (
        <div className="space-y-1.5">
          {entries.map(([ip, count]) => (
            <div key={ip} className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/30">
              <span className="text-xs font-mono">{ip}</span>
              <Badge
                variant={count >= 10 ? "destructive" : count >= 5 ? "secondary" : "outline"}
                className="text-[10px] px-2"
              >
                {count} attempt{count !== 1 ? "s" : ""}
              </Badge>
            </div>
          ))}
        </div>
      )}
      {entries.length > 0 && (
        <Button variant="outline" size="sm" onClick={handleClear} className="h-8 text-xs border-border/50">
          Clear all
        </Button>
      )}
    </div>
  )
}
