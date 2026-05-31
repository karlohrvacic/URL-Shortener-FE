"use client"

import { useQuery } from "@tanstack/react-query"
import { analyticsApi } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"
import { PageMeta } from "@/components/page-meta"
import { BarChart3, LinkIcon, CheckCircle2, Clock } from "lucide-react"

export default function AnalyticsPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => analyticsApi.getOverview(),
  })

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="max-w-3xl mx-auto">
        <PageMeta title="Dashboard — Analytics" />
        <p className="text-sm text-destructive">Failed to load analytics</p>
      </div>
    )
  }

  const cards = [
    { icon: BarChart3, label: "Total visits", value: stats.totalVisits.toLocaleString() },
    { icon: LinkIcon, label: "URLs", value: stats.totalUrls.toLocaleString() },
    { icon: CheckCircle2, label: "Active", value: stats.activeUrls.toLocaleString() },
    { icon: Clock, label: "Expired", value: stats.expiredUrls.toLocaleString() },
  ]

  const maxVisits = Math.max(1, ...stats.topUrls.map((u) => u.visits))

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageMeta title="Dashboard — Analytics" description="Visit analytics across your shortened URLs." />
      <div className="space-y-1">
        <h1 className="text-2xl font-display tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Visit totals across your links</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="border-border/50">
            <CardContent className="p-5">
              <c.icon className="h-4 w-4 text-primary mb-3" />
              <p className="font-display text-2xl text-primary">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/40">
        <CardContent className="p-6">
          <h2 className="text-sm font-medium mb-4">Top URLs by visits</h2>
          {stats.topUrls.length === 0 ? (
            <p className="text-sm text-muted-foreground">No URLs yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topUrls.map((u) => (
                <div key={u.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-primary truncate max-w-[60%]">/{u.shortUrl}</span>
                    <span className="text-muted-foreground">{u.visits.toLocaleString()} visits</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full bg-primary/70 rounded-full" style={{ width: `${(u.visits / maxVisits) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate" title={u.longUrl}>{u.longUrl}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
