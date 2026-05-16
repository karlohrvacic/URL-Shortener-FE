"use client"

import type { UrlResponse } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDate } from "@/lib/utils"
import { Eye, Target, Calendar, LinkIcon, ExternalLink } from "lucide-react"

interface UrlAnalyticsProps {
  url: UrlResponse
}

export function UrlAnalytics({ url }: UrlAnalyticsProps) {
  const created = new Date(url.createDate)
  const daysSinceCreation = Math.max(1, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)))
  const dailyAvg = daysSinceCreation > 0 ? (url.visits / daysSinceCreation).toFixed(1) : "0"
  const visitPercent = url.visitLimit > 0 ? Math.min(100, (url.visits / url.visitLimit) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{url.visits}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{url.visitLimit > 0 ? `${url.visitLimit}` : "\u221E"}</p>
              <p className="text-xs text-muted-foreground">Visit Limit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">{formatDate(url.createDate)}</p>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3 min-w-0">
            <LinkIcon className="h-8 w-8 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" title={url.longUrl}>
                {url.longUrl}
              </p>
              <p className="text-xs text-muted-foreground">Destination</p>
            </div>
            <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 ml-auto">
              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Visit limit usage</span>
          <span>
            {url.visits} / {url.visitLimit > 0 ? url.visitLimit : "\u221E"}
            {url.visitLimit > 0 ? ` (${Math.round(visitPercent)}%)` : ""}
          </span>
        </div>
        <Progress value={url.visitLimit > 0 ? visitPercent : 0} />
      </div>

      {url.visits > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="tabular-nums">{dailyAvg}</span>
          <span>visits/day over {daysSinceCreation} day{daysSinceCreation > 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  )
}
