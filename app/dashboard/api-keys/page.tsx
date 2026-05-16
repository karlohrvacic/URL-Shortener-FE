"use client"

import { useState } from "react"
import { useMyApiKeys, useGenerateApiKey, useRevokeApiKey, useUpdateApiKey } from "@/lib/hooks/useApiKeys"
import type { ApiKeyResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, Copy, Check, Plus, ShieldAlert, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { formatDate, maskApiKey } from "@/lib/utils"
import { PageMeta } from "@/components/page-meta"

export default function ApiKeysPage() {
  const { data: apiKeys, isLoading, error } = useMyApiKeys()
  const generateKey = useGenerateApiKey()
  const revokeKey = useRevokeApiKey()
  const updateKey = useUpdateApiKey()
  const [showGenerate, setShowGenerate] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [newKeyCopied, setNewKeyCopied] = useState(false)
  const [editKey, setEditKey] = useState<ApiKeyResponse | null>(null)
  const [editLimit, setEditLimit] = useState("")
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set())
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null)

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyKeyToClipboard = async (key: string, id: number) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKeyId(id)
      setTimeout(() => setCopiedKeyId(null), 2000)
      toast.success("API key copied!")
    } catch {
      toast.error("Failed to copy")
    }
  }

  const handleGenerate = async () => {
    try {
      const key = await generateKey.mutateAsync()
      setNewKey(key.key)
      toast.success("API key generated!")
    } catch (err: any) {
      toast.error(err.message || "Failed to generate API key")
    }
  }

  const handleRevoke = async (id: number) => {
    try {
      await revokeKey.mutateAsync(id)
      toast.success("API key revoked")
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke")
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
    <div className="space-y-8">
      <PageMeta title="Dashboard — API Keys" description="Manage API keys for programmatic URL shortening on hrva.cc." />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
      </div>

      {/* Generate key dialog */}
      <Dialog open={showGenerate} onOpenChange={(open) => { setShowGenerate(open); if (!open) setNewKey(null) }}>
        <Button
          onClick={() => setShowGenerate(true)}
          className="h-9 gap-1.5 bg-primary text-primary-foreground hover:brightness-110 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Generate Key
        </Button>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">{newKey ? "API Key Generated" : "Generate New API Key"}</DialogTitle>
            {!newKey && <DialogDescription className="text-muted-foreground text-sm">Create a new API key for programmatic URL shortening.</DialogDescription>}
          </DialogHeader>
          {!newKey ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">This will create a new API key associated with your account.</p>
              <Button onClick={handleGenerate} className="w-full h-9 bg-primary text-primary-foreground hover:brightness-110 text-xs" disabled={generateKey.isPending}>
                {generateKey.isPending ? "Generating…" : "Generate"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Copy this key now. You won&apos;t be able to see it again!
                </p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/80 border border-border/40">
                  <code className="text-xs font-mono truncate text-foreground">{newKey}</code>
                  <Button variant="ghost" size="icon" onClick={() => {
                    navigator.clipboard.writeText(newKey)
                    setNewKeyCopied(true)
                    setTimeout(() => setNewKeyCopied(false), 2000)
                    toast.success("Copied!")
                  }} className="h-7 w-7 shrink-0 ml-2">
                    {newKeyCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full h-9 text-xs border-border/50" onClick={() => { setShowGenerate(false); setNewKey(null) }}>
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editKey} onOpenChange={(open) => { if (!open) setEditKey(null) }}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Edit API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">API Call Limit</Label>
              <Input type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} placeholder={editKey?.apiCallsLimit.toString()} className="h-10 bg-background/50 border-border/50" />
            </div>
            <Button onClick={handleEditSave} disabled={updateKey.isPending} className="h-9 text-xs bg-primary text-primary-foreground hover:brightness-110">
              {updateKey.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <Card className="border-border/40">
          <CardContent className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-muted/50" />
            ))}
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-border/40">
          <CardContent className="p-8 text-center space-y-3">
            <p className="text-sm text-destructive">Failed to load API keys</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-border/50">Retry</Button>
          </CardContent>
        </Card>
      ) : !apiKeys || apiKeys.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="p-16 text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mx-auto">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-lg tracking-tight">No API keys</h3>
              <p className="text-sm text-muted-foreground">Generate an API key to use the URL shortener programmatically.</p>
            </div>
            <Button onClick={() => setShowGenerate(true)} size="sm" className="bg-primary text-primary-foreground hover:brightness-110">
              Generate Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Key</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden md:table-cell">Created</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10 hidden lg:table-cell">Expires</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Usage</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Status</TableHead>
                  <TableHead className="text-right text-xs font-medium text-muted-foreground tracking-wide uppercase h-10">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key: ApiKeyResponse) => {
                  const isVisible = visibleKeys.has(key.id)
                  const displayKey = isVisible ? key.key : maskApiKey(key.key)

                  return (
                    <TableRow key={key.id} className="border-border/20 hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <code className="text-sm font-mono bg-muted/30 px-2 py-0.5 rounded text-muted-foreground">
                            {displayKey}
                          </code>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground shrink-0"
                              >
                                {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">
                              {isVisible ? "Hide key" : "Reveal key"}
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyKeyToClipboard(key.key, key.id)}
                                className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground shrink-0"
                              >
                                {copiedKeyId === key.id
                                  ? <Check className="h-3.5 w-3.5 text-success" />
                                  : <Copy className="h-3.5 w-3.5" />
                                }
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Copy key</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(key.createDate)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{key.expirationDate ? formatDate(key.expirationDate) : <span className="text-muted-foreground">Never</span>}</TableCell>
                      <TableCell className="text-sm">{key.apiCallsUsed} / {key.apiCallsLimit > 0 ? key.apiCallsLimit : "\u221E"}</TableCell>
                      <TableCell>
                        <Badge variant={key.active ? "success" : "destructive"} className="text-[11px] px-2 py-0.5 font-medium">
                          {key.active ? "Active" : "Revoked"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => { setEditKey(key); setEditLimit(key.apiCallsLimit.toString()) }}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-[11px]">Edit limit</TooltipContent>
                          </Tooltip>
                          {key.active && (
                            <Tooltip>
                              <AlertDialog>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-destructive/60 hover:text-destructive">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-[11px]">Revoke key</TooltipContent>
                                <AlertDialogContent className="bg-card border-border/50">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-display text-lg">Revoke API Key?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                      This will permanently revoke this API key. Any services using it will stop working.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-border/40">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRevoke(key.id)} className="bg-destructive text-destructive-foreground">
                                      Revoke
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
