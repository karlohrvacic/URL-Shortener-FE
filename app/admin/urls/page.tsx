"use client"

import { useState, useEffect } from "react"
import { useAllUrls, useDeactivateUrl, useActivateUrl, useDeleteUrl, useUpdateUrl } from "@/lib/hooks/useUrls"
import { usePagination } from "@/lib/hooks/usePagination"
import { Pagination } from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Trash2, ToggleRight, ToggleLeft, LinkIcon, ArrowUpDown, ArrowUp, ArrowDown, Edit } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatDateTime, truncateUrl, formatShortUrl } from "@/lib/utils"
import { adminApi, urlApi } from "@/lib/api-client"
import { PageMeta } from "@/components/page-meta"
import type { UrlResponse, UrlFilters } from "@/lib/types"

export default function AdminUrlsPage() {
  const { page, size, sort, order, setPage, setSize, toggleSort, sortDir } = usePagination()
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [expiredFilter, setExpiredFilter] = useState(false)
  useEffect(() => { setPage(0) }, [search, activeFilter, expiredFilter])
  const filterKey = `${search}-${activeFilter}-${expiredFilter}`
  const filters: UrlFilters = {
    search: search || undefined,
    active: activeFilter === "all" ? undefined : activeFilter === "active",
    expired: expiredFilter || undefined,
  }
  const { data: urls, isLoading, error } = useAllUrls(filters, page, size, sort, order)
  const deactivateUrl = useDeactivateUrl()
  const activateUrl = useActivateUrl()
  const deleteUrl = useDeleteUrl()
  const updateUrl = useUpdateUrl()
  const [editUrl, setEditUrl] = useState<UrlResponse | null>(null)
  const [editVisitLimit, setEditVisitLimit] = useState("")
  const [editExpiration, setEditExpiration] = useState("")

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateUrl.mutateAsync(id)
      toast.success("URL deactivated")
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate")
    }
  }

  const handleActivate = async (id: number) => {
    try {
      await activateUrl.mutateAsync(id)
      toast.success("URL activated")
    } catch (err: any) {
      toast.error(err.message || "Failed to activate")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteUrl.mutateAsync(id)
      toast.success("URL deleted permanently")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete")
    }
  }

  const handleEditOpen = (url: UrlResponse) => {
    setEditUrl(url)
    setEditVisitLimit(url.visitLimit?.toString() || "")
    setEditExpiration(url.expirationDate ? url.expirationDate.slice(0, 16) : "")
  }

  const handleEditSave = async () => {
    if (!editUrl) return
    try {
      await updateUrl.mutateAsync({
        id: editUrl.id,
        data: {
          id: editUrl.id,
          visitLimit: editVisitLimit ? parseInt(editVisitLimit) : 0,
          expirationDate: editExpiration ? new Date(editExpiration).toISOString() : undefined,
        },
      })
      toast.success("URL updated")
      setEditUrl(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update URL")
    }
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — All URLs" description="View all shortened URLs in the hrva.cc system." />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display tracking-tight">All URLs</h1>
          <p className="text-sm text-muted-foreground">View all shortened URLs in the system</p>
        </div>
        <Button
          onClick={() => adminApi.exportUrlsCsv()}
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-border/50 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search URLs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={expiredFilter}
            onChange={(e) => setExpiredFilter(e.target.checked)}
            className="rounded border-input"
          />
          Expired only
        </label>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load URLs</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : !urls || !urls.content || urls.content.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No URLs found</h3>
          </CardContent>
        </Card>
      ) : (
        <Card key={filterKey} className="border-border/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead className="hidden lg:table-cell">Long URL</TableHead>
                  <TableHead className="hidden lg:table-cell">Owner</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("visits")}>
                    <div className="flex items-center gap-1">
                      Visits
                      {sortDir("visits") === "asc" ? <ArrowUp className="h-3 w-3" /> : sortDir("visits") === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />}
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("createDate")}>
                    <div className="flex items-center gap-1">
                      Created
                      {sortDir("createDate") === "asc" ? <ArrowUp className="h-3 w-3" /> : sortDir("createDate") === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.content.map((url: UrlResponse, i: number) => (
                  <TableRow key={url.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <TableCell><span className="text-primary font-medium">/{url.shortUrl}</span></TableCell>
                    <TableCell className="max-w-[200px] hidden lg:table-cell">
                      <span className="truncate block" title={url.longUrl}>{truncateUrl(url.longUrl, 40)}</span>
                    </TableCell>
                    <TableCell className="text-sm hidden lg:table-cell">{url.ownerEmail || "\u2014"}</TableCell>
                    <TableCell className="text-sm">{url.visits}{url.visitLimit > 0 ? ` / ${url.visitLimit}` : ""}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell" title={formatDateTime(url.createDate)}>{formatDate(url.createDate)}</TableCell>
                    <TableCell>
                      <Badge variant={url.active ? "default" : "destructive"} className="text-[10px] px-2 py-0.5">
                        {url.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        {url.active ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleDeactivate(url.id)}
                                disabled={deactivateUrl.isPending}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                              >
                                <ToggleRight className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Deactivate</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleActivate(url.id)}
                                disabled={activateUrl.isPending}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                              >
                                <ToggleLeft className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Activate</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleEditOpen(url)}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[11px]">Edit URL</TooltipContent>
                        </Tooltip>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-[11px]">Delete</TooltipContent>
                            </Tooltip>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete URL?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete /{url.shortUrl}.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(url.id)} className="bg-destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            <Pagination
              page={page}
              totalPages={urls?.totalPages ?? 0}
              totalElements={urls?.totalElements}
              size={size}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit URL Dialog */}
      <Dialog open={!!editUrl} onOpenChange={(open) => { if (!open) setEditUrl(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit URL — /{editUrl?.shortUrl}</DialogTitle>
          </DialogHeader>
          {editUrl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Visit Limit</label>
                <Input
                  type="number"
                  placeholder="e.g. 100 (0 = unlimited)"
                  value={editVisitLimit}
                  onChange={(e) => setEditVisitLimit(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Expiration Date</label>
                <Input
                  type="datetime-local"
                  value={editExpiration}
                  onChange={(e) => setEditExpiration(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <Button onClick={handleEditSave} disabled={updateUrl.isPending} className="w-full">
                {updateUrl.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
