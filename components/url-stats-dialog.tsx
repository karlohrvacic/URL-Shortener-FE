"use client"

import { useQuery } from "@tanstack/react-query"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { analyticsApi } from "@/lib/api-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"

interface UrlStatsDialogProps {
  urlId: number | null
  onClose: () => void
}

export function UrlStatsDialog({ urlId, onClose }: UrlStatsDialogProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "url", urlId],
    queryFn: () => analyticsApi.getUrlAnalytics(urlId as number),
    enabled: urlId != null,
  })

  const chartData = (data?.dailyNewVisitors ?? []).map((d) => ({
    day: d.date.slice(5), // MM-DD
    count: d.count,
  }))

  return (
    <Dialog open={urlId != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display tracking-tight">
            {data ? `/${data.shortUrl}` : "URL analytics"}
          </DialogTitle>
        </DialogHeader>

        {isLoading || !data ? (
          <div className="h-48 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <StatusBadge status={data.status} className="text-[11px] px-2 py-0.5" />
              <span className="text-xs text-muted-foreground truncate" title={data.longUrl}>{data.longUrl}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Total visits" value={data.visits} />
              <Stat label="Unique (recent)" value={data.uniqueRecentVisitors} />
              <Stat label="Clicks (recent)" value={data.totalRecentClicks} />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">New visitors · last 30 days</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={6} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#0f0f0f" }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Recent-visitor data is retained for a limited window; total visits is cumulative.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/40 p-3">
      <p className="font-display text-xl text-primary">{value.toLocaleString()}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}
