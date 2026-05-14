"use client"

import { useAllUrls, useDeactivateUrl, useDeleteUrl } from "@/lib/hooks/useUrls"
import type { Url } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, ToggleLeft, LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { formatDate, truncateUrl } from "@/lib/utils"
import { PageMeta } from "@/components/page-meta"

export default function AdminUrlsPage() {
  const { data: urls, isLoading, error } = useAllUrls()
  const deactivateUrl = useDeactivateUrl()
  const deleteUrl = useDeleteUrl()

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
      toast.success("URL deleted")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — All URLs" description="View all shortened URLs in the hrva.cc system." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">All URLs</h1>
        <p className="text-sm text-muted-foreground">View all shortened URLs in the system</p>
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
      ) : !urls || urls.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No URLs in the system</h3>
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
                  <TableHead>Owner</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls.map((url: Url) => (
                  <TableRow key={url.id}>
                    <TableCell><span className="text-primary font-medium">/{url.shortUrl}</span></TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="truncate block" title={url.longUrl}>{truncateUrl(url.longUrl, 40)}</span>
                    </TableCell>
                    <TableCell className="text-sm">{url.owner?.email || "\u2014"}</TableCell>
                    <TableCell className="text-sm">{url.visits}{url.visitLimit > 0 ? ` / ${url.visitLimit}` : ""}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(url.createDate)}</TableCell>
                    <TableCell>
                      <Badge variant={url.active ? "success" : "destructive"}>
                        {url.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {url.active && (
                          <Button variant="ghost" size="icon" onClick={() => handleDeactivate(url.id)} disabled={deactivateUrl.isPending}>
                            <ToggleLeft className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete URL?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently delete this URL.</AlertDialogDescription>
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
