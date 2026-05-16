"use client"

import { useState } from "react"
import { useMyUrls, useDeactivateUrl, useDeleteUrl } from "@/lib/hooks/useUrls"
import { usePagination } from "@/lib/hooks/usePagination"
import { useMyApiKeys } from "@/lib/hooks/useApiKeys"
import { Pagination } from "@/components/ui/pagination"
import type { UrlResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QRCodeSVG } from "qrcode.react"
import { Copy, ExternalLink, Key, QrCode, Trash2, ToggleLeft, BarChart3, Plus, LinkIcon, Download } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatDateTime, formatRelativeDate, truncateUrl, formatShortUrl } from "@/lib/utils"
import { urlApi } from "@/lib/api-client"
import { CreateUrlDialog } from "@/components/dashboard/create-url-dialog"
import { UrlAnalytics } from "@/components/dashboard/url-analytics"
import { PageMeta } from "@/components/page-meta"

export default function DashboardPage() {
  const { page, size, setPage, setSize } = usePagination()
  const { data: urls, isLoading, error } = useMyUrls(page, size)
  const deactivateUrl = useDeactivateUrl()
  const deleteUrl = useDeleteUrl()
  const { data: apiKeys } = useMyApiKeys()
  const totalKeys = apiKeys?.length ?? 0
  const activeKeys = apiKeys?.filter(k => k.active).length ?? 0
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied!")
  }

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateUrl.mutateAsync(id)
      toast.success("URL deactivated")
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate")
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

  return (
    <div className="space-y-8">
      <PageMeta title="Dashboard — My URLs" description="Manage and track your shortened URLs on hrva.cc." />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display tracking-tight">My URLs</h1>
          <p className="text-sm text-muted-foreground">Manage and track your shortened links</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => urlApi.exportCsv()}
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-border/50 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="h-9 gap-1.5 bg-primary text-primary-foreground hover:brightness-110 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            New URL
          </Button>
        </div>
      </div>

      <CreateUrlDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="tabular-nums">{urls?.content?.length ?? 0}</span>
          <span>URLs</span>
        </div>
        <div className="w-px h-4 bg-border/50" />
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Key className="h-3.5 w-3.5" />
          <span className="tabular-nums">{activeKeys}/{totalKeys}</span>
          <span>API keys active</span>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <Card className="border-border/40">
          <CardContent className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-muted/50" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-border/40">
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-sm text-destructive">Failed to load URLs</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-border/50">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : !urls || !urls.content || urls.content.length === 0 ? (
        /* Empty state */
        <Card className="border-border/40">
          <CardContent className="p-16 text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mx-auto">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-lg tracking-tight">No URLs yet</h3>
              <p className="text-sm text-muted-foreground">Shorten your first URL to get started!</p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              className="bg-primary text-primary-foreground hover:brightness-110"
            >
              Shorten a URL
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* URL Table */
        <Card className="border-border/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Short URL</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden md:table-cell">Long URL</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Visits</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Expires</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Status</TableHead>
                  <TableHead className="text-right text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.content.map((url: UrlResponse) => (
                  <TableRow key={url.id} className="border-border/20 hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <button
                        onClick={() => copyToClipboard(formatShortUrl(url.shortUrl))}
                        className="text-primary hover:underline font-medium text-sm text-left"
                      >
                        /{url.shortUrl}
                      </button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px]">
                      <span className="text-sm text-muted-foreground truncate block" title={url.longUrl}>
                        {truncateUrl(url.longUrl, 40)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{url.visits}</span>
                        {url.visitLimit > 0 && (
                          <>
                            <span className="text-muted-foreground text-xs">/ {url.visitLimit}</span>
                            <Progress
                              value={(url.visits / url.visitLimit) * 100}
                              className="w-16 h-1.5 bg-muted/50 [&>div]:bg-primary/60"
                            />
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground" title={formatDateTime(url.createDate)}>{formatDate(url.createDate)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{formatRelativeDate(url.expirationDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={url.active ? "success" : "destructive"}
                        className="text-[11px] px-2 py-0.5 font-medium"
                      >
                        {url.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => copyToClipboard(formatShortUrl(url.shortUrl))}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[11px]">Copy short URL</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={url.longUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground inline-flex"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[11px]">Open original URL</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <Dialog>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                  <QrCode className="h-3.5 w-3.5" />
                                </button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Show QR code</TooltipContent>
                            <DialogContent className="bg-card border-border/50">
                              <DialogHeader>
                                <DialogTitle className="font-display text-lg">QR Code</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center gap-4 p-4">
                                <div className="relative p-4 rounded-xl bg-background/50 border border-border/30">
                                  <QRCodeSVG value={formatShortUrl(url.shortUrl)} size={180} fgColor="#a67c00" bgColor="transparent" level="M" />
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const svg = document.querySelector(".qr-download-area svg") as SVGElement
                                    if (svg) {
                                      const svgData = new XMLSerializer().serializeToString(svg)
                                      const canvas = document.createElement("canvas")
                                      const ctx = canvas.getContext("2d")
                                      const img = new Image()
                                      img.onload = () => {
                                        canvas.width = 180
                                        canvas.height = 180
                                        ctx?.drawImage(img, 0, 0, 180, 180)
                                        const link = document.createElement("a")
                                        link.download = `${url.shortUrl}-qrcode.png`
                                        link.href = canvas.toDataURL()
                                        link.click()
                                      }
                                      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
                                    }
                                  }}
                                  className="border-border/40 text-xs"
                                >
                                  <Download className="h-3.5 w-3.5 mr-1.5" />
                                  Download PNG
                                </Button>
                              </div>
                              <div className="qr-download-area flex justify-center hidden">
                                <QRCodeSVG value={formatShortUrl(url.shortUrl)} size={180} fgColor="#a67c00" bgColor="transparent" level="M" />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </Tooltip>

                        <Tooltip>
                          <Dialog>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                  <BarChart3 className="h-3.5 w-3.5" />
                                </button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">View analytics</TooltipContent>
                            <DialogContent className="max-w-2xl bg-card border-border/50">
                              <DialogHeader>
                                <DialogTitle className="font-display text-lg">Analytics — /{url.shortUrl}</DialogTitle>
                              </DialogHeader>
                              <UrlAnalytics url={url} />
                            </DialogContent>
                          </Dialog>
                        </Tooltip>

                        {url.active && (
                          <Tooltip>
                            <AlertDialog>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                                    disabled={deactivateUrl.isPending}
                                  >
                                    <ToggleLeft className="h-3.5 w-3.5" />
                                  </button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-[11px]">Deactivate URL</TooltipContent>
                              <AlertDialogContent className="bg-card border-border/50">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-display text-lg">Deactivate URL?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    This will deactivate the short link. Anyone clicking it will no longer be redirected. You can reactivate it later.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-border/40">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeactivate(url.id)} className="bg-destructive text-destructive-foreground">
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <AlertDialog>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-destructive/60 hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Delete URL</TooltipContent>
                            <AlertDialogContent className="bg-card border-border/50">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display text-lg">Delete URL?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This action cannot be undone. The URL will be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border/40">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(url.id)} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </Tooltip>
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
