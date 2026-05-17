"use client"

import { useQuery } from "@tanstack/react-query"
import { usePagination } from "@/lib/hooks/usePagination"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageMeta } from "@/components/page-meta"
import { Mail } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { adminApi } from "@/lib/api-client"
import type { EmailLog, Page } from "@/lib/types"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "success" | "outline"> = {
  SENT: "success",
  FAILED: "destructive",
  SENDING: "secondary",
}

export default function AdminEmailLogPage() {
  const { page, size, setPage, setSize } = usePagination()
  const { data, isLoading, error } = useQuery<Page<EmailLog>>({
    queryKey: ["admin", "email-log", page, size],
    queryFn: () => adminApi.getEmailLog(page, size),
  })

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — Email Log" description="View email delivery status." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">Email Log</h1>
        <p className="text-sm text-muted-foreground">View email delivery status</p>
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
            <p className="text-sm text-destructive">Failed to load email log</p>
          </CardContent>
        </Card>
      ) : !data || data.content.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No emails sent yet</h3>
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
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Recipient</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Subject</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Status</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((entry) => (
                  <TableRow key={entry.id} className="border-border/20">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(entry.createdAt)}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{entry.recipient}</TableCell>
                    <TableCell className="text-xs max-w-[250px] truncate">{entry.subject}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[entry.status] ?? "secondary"} className="text-[10px] px-2 py-0.5">
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate hidden lg:table-cell">
                      {entry.errorMessage || "—"}
                    </TableCell>
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
