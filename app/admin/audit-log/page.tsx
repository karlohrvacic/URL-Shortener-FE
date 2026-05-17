"use client"

import { useQuery } from "@tanstack/react-query"
import { usePagination } from "@/lib/hooks/usePagination"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageMeta } from "@/components/page-meta"
import { History } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { adminApi } from "@/lib/api-client"
import type { AuditLog, Page } from "@/lib/types"

const actionColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  deactivateUrl: "destructive",
  revokeUrl: "destructive",
  deleteUrl: "destructive",
  deleteUser: "destructive",
  activateUrl: "default",
  updateUrl: "secondary",
  updateUser: "secondary",
}

function actionLabel(action: string): string {
  return action
    .replace(/([A-Z])/g, " $1")
    .replace(/_FAILED$/, " (failed)")
    .trim()
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase())
}

export default function AdminAuditLogPage() {
  const { page, size, setPage, setSize } = usePagination()
  const { data, isLoading, error } = useQuery<Page<AuditLog>>({
    queryKey: ["admin", "audit-log", page, size],
    queryFn: () => adminApi.getAuditLog(page, size),
  })

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — Audit Log" description="Track administrative actions across the system." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Track administrative actions across the system</p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-sm text-destructive">Failed to load audit log</p>
          </CardContent>
        </Card>
      ) : !data || data.content.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No audit log entries</h3>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Time</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Admin</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Action</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden md:table-cell">Target Type</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden md:table-cell">Target</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((entry) => (
                  <TableRow key={entry.id} className="border-border/20">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(entry.performedAt)}</TableCell>
                    <TableCell className="text-xs font-medium">{entry.performedBy}</TableCell>
                    <TableCell>
                      <Badge variant={actionColors[entry.action] ?? "secondary"} className="text-[10px] px-2 py-0.5">
                        {actionLabel(entry.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden md:table-cell capitalize">{entry.targetType}</TableCell>
                    <TableCell className="text-xs font-mono max-w-[150px] truncate hidden md:table-cell">{entry.targetIdentifier || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate hidden lg:table-cell">{entry.details || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            <Pagination
              page={page}
              totalPages={data?.totalPages ?? 0}
              totalElements={data?.totalElements}
              size={size}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
