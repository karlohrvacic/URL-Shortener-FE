"use client"

import { useAllApiKeys, useRevokeApiKey, useActivateApiKey, useUpdateApiKey } from "@/lib/hooks/useApiKeys"
import { usePagination } from "@/lib/hooks/usePagination"
import { Pagination } from "@/components/ui/pagination"
import type { ApiKeyResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleRight, ToggleLeft, Key, Shield, Edit, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { formatDate, formatDateTime, maskApiKey } from "@/lib/utils"
import { PageMeta } from "@/components/page-meta"
import { useState } from "react"

export default function AdminApiKeysPage() {
  const { page, size, setPage, setSize } = usePagination()
  const { data: apiKeys, isLoading, error } = useAllApiKeys(page, size)
  const revokeKey = useRevokeApiKey()
  const activateKey = useActivateApiKey()
  const updateKey = useUpdateApiKey()
  const [editKey, setEditKey] = useState<ApiKeyResponse | null>(null)
  const [editLimit, setEditLimit] = useState("")

  const handleRevoke = async (id: number) => {
    try {
      await revokeKey.mutateAsync(id)
      toast.success("API key revoked")
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke")
    }
  }

  const handleActivate = async (id: number) => {
    try {
      await activateKey.mutateAsync(id)
      toast.success("API key activated")
    } catch (err: any) {
      toast.error(err.message || "Failed to activate")
    }
  }

  const handleEditSave = async () => {
    if (!editKey) return
    try {
      await updateKey.mutateAsync({
        id: editKey.id,
        data: {
          id: editKey.id,
          apiCallsLimit: parseInt(editLimit) || editKey.apiCallsLimit,
        },
      })
      toast.success("API key updated")
      setEditKey(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update")
    }
  }

  return (
    <div className="space-y-6">
      <PageMeta title="Admin — API Keys" description="View all API keys in the hrva.cc system." />
      <div>
        <h1 className="text-2xl font-display tracking-tight">All API Keys</h1>
        <p className="text-sm text-muted-foreground">View all API keys in the system</p>
      </div>

      <Dialog open={!!editKey} onOpenChange={(open) => { if (!open) setEditKey(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
          </DialogHeader>
          {editKey && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Call Limit</Label>
                <Input type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} />
              </div>
              <Button onClick={handleEditSave} disabled={updateKey.isPending} className="w-full">
                {updateKey.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Failed to load API keys</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      ) : !apiKeys || !apiKeys.content || apiKeys.content.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys</h3>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Key</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Owner</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Usage</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Status</TableHead>
                  <TableHead className="text-right text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.content.map((key: ApiKeyResponse, i: number) => (
                  <TableRow key={key.id} className="border-border/20 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <TableCell><span className="text-xs font-mono">{maskApiKey(key.key)}</span></TableCell>
                    <TableCell className="text-sm hidden lg:table-cell">{key.ownerEmail || "\u2014"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell" title={formatDateTime(key.createDate)}>{formatDate(key.createDate)}</TableCell>
                    <TableCell className="text-sm">{key.apiCallsUsed}/{key.apiCallsLimit > 0 ? key.apiCallsLimit : "\u221E"}</TableCell>
                    <TableCell>
                      <Badge variant={key.active ? "success" : "destructive"} className="text-[10px] px-2 py-0.5">
                        {key.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => { setEditKey(key); setEditLimit(key.apiCallsLimit.toString()) }}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-[11px]">Edit API key</TooltipContent>
                        </Tooltip>
                        {key.active ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => handleRevoke(key.id)} disabled={revokeKey.isPending}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                <ToggleRight className="h-3.5 w-3.5 text-success" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Revoke API key</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => handleActivate(key.id)} disabled={activateKey.isPending}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                                <ToggleLeft className="h-3.5 w-3.5 text-destructive" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Activate API key</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            <Pagination
              page={page}
              totalPages={apiKeys?.totalPages ?? 0}
              totalElements={apiKeys?.totalElements}
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
