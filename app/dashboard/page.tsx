"use client"

import { useState } from "react"
import { useMyUrls, useDeactivateUrl, useDeleteUrl } from "@/lib/hooks/useUrls"
import type { Url } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QRCodeSVG } from "qrcode.react"
import { Copy, ExternalLink, QrCode, Trash2, ToggleLeft, BarChart3, Plus, LinkIcon, Download } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatRelativeDate, truncateUrl, formatShortUrl } from "@/lib/utils"
import { CreateUrlDialog } from "@/components/dashboard/create-url-dialog"
import { UrlAnalytics } from "@/components/dashboard/url-analytics"

export default function DashboardPage() {
  const { data: urls, isLoading, error } = useMyUrls()
  const deactivateUrl = useDeactivateUrl()
  const deleteUrl = useDeleteUrl()
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My URLs</h1>
          <p className="text-muted-foreground">Manage and track your shortened URLs</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New URL
        </Button>
      </div>

      <CreateUrlDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

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
      ) : !urls || urls.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
            <p className="text-muted-foreground mb-4">Shorten your first URL to get started!</p>
            <Button onClick={() => setShowCreateDialog(true)}>Shorten a URL</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Long URL</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url: Url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <button onClick={() => copyToClipboard(formatShortUrl(url.shortUrl))}
                        className="text-primary hover:underline font-medium text-left">
                        /{url.shortUrl}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="truncate block" title={url.longUrl}>
                        {truncateUrl(url.longUrl, 40)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{url.visits}</span>
                        {url.visitLimit > 0 && (
                          <>
                            <span className="text-muted-foreground text-sm">/ {url.visitLimit}</span>
                            <Progress value={(url.visits / url.visitLimit) * 100} className="w-20 h-2" />
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(url.createDate)}</TableCell>
                    <TableCell className="text-sm">{formatRelativeDate(url.expirationDate)}</TableCell>
                    <TableCell>
                      <Badge variant={url.active ? "success" : "destructive"}>
                        {url.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => copyToClipboard(formatShortUrl(url.shortUrl))}
                          className="p-2 hover:bg-muted rounded-md transition-colors">
                          <Copy className="h-4 w-4" />
                        </button>
                        <a href={url.longUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-md transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="p-2 hover:bg-muted rounded-md transition-colors">
                              <QrCode className="h-4 w-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>QR Code</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-4 p-4">
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg inline-block">
                                <QRCodeSVG value={formatShortUrl(url.shortUrl)} size={200} />
                              </div>
                              <Button variant="outline" onClick={() => {
                                const svg = document.querySelector(".qr-code-area svg") as SVGElement
                                if (svg) {
                                  const svgData = new XMLSerializer().serializeToString(svg)
                                  const canvas = document.createElement("canvas")
                                  const ctx = canvas.getContext("2d")
                                  const img = new Image()
                                  img.onload = () => {
                                    canvas.width = 200
                                    canvas.height = 200
                                    ctx?.drawImage(img, 0, 0, 200, 200)
                                    const link = document.createElement("a")
                                    link.download = `${url.shortUrl}-qrcode.png`
                                    link.href = canvas.toDataURL()
                                    link.click()
                                  }
                                  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
                                }
                              }}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PNG
                              </Button>
                            </div>
                            <div className="qr-code-area flex justify-center hidden">
                              <QRCodeSVG value={formatShortUrl(url.shortUrl)} size={200} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="p-2 hover:bg-muted rounded-md transition-colors">
                              <BarChart3 className="h-4 w-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Analytics for /{url.shortUrl}</DialogTitle>
                            </DialogHeader>
                            <UrlAnalytics url={url} />
                          </DialogContent>
                        </Dialog>
                        {url.active && (
                          <button onClick={() => handleDeactivate(url.id)}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            disabled={deactivateUrl.isPending}>
                            <ToggleLeft className="h-4 w-4" />
                          </button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 hover:bg-muted rounded-md transition-colors">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete URL?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone. The URL will be permanently deleted.</AlertDialogDescription>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}
