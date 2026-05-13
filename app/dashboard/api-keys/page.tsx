"use client"

import { useState } from "react"
import { useMyApiKeys, useGenerateApiKey, useRevokeApiKey, useUpdateApiKey } from "@/lib/hooks/useApiKeys"
import type { ApiKey } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Key, Copy, Check, ToggleLeft, Plus, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { formatDate, maskApiKey } from "@/lib/utils"

export default function ApiKeysPage() {
  const { data: apiKeys, isLoading, error } = useMyApiKeys()
  const generateKey = useGenerateApiKey()
  const revokeKey = useRevokeApiKey()
  const updateKey = useUpdateApiKey()
  const [showGenerate, setShowGenerate] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [editKey, setEditKey] = useState<ApiKey | null>(null)
  const [editLimit, setEditLimit] = useState("")

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
        apiCallsLimit: parseInt(editLimit) || editKey.apiCallsLimit,
      })
      toast.success("API key updated")
      setEditKey(null)
    } catch (err: any) {
      toast.error(err.message || "Failed to update")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
        <Dialog open={showGenerate} onOpenChange={(open) => { setShowGenerate(open); if (!open) setNewKey(null) }}>
          <Button onClick={() => setShowGenerate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Key
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{newKey ? "API Key Generated" : "Generate New API Key"}</DialogTitle>
              {!newKey && <DialogDescription>Create a new API key for programmatic URL shortening.</DialogDescription>}
            </DialogHeader>
            {!newKey ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">This will create a new API key associated with your account.</p>
                <Button onClick={handleGenerate} className="w-full" disabled={generateKey.isPending}>
                  {generateKey.isPending ? "Generating..." : "Generate"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    <ShieldAlert className="h-4 w-4 inline mr-1" />
                    Copy this key now. You won&apos;t be able to see it again!
                  </p>
                  <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-xs font-mono truncate">{newKey}</code>
                    <Button variant="ghost" size="icon" onClick={() => {
                      navigator.clipboard.writeText(newKey)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                      toast.success("Copied!")
                    }}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => { setShowGenerate(false); setNewKey(null) }}>Done</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editKey} onOpenChange={(open) => { if (!open) setEditKey(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Call Limit</Label>
              <Input type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} placeholder={editKey?.apiCallsLimit.toString()} />
            </div>
            <Button onClick={handleEditSave} disabled={updateKey.isPending}>
              {updateKey.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
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
      ) : !apiKeys || apiKeys.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys</h3>
            <p className="text-muted-foreground mb-4">Generate an API key to use the URL shortener programmatically.</p>
            <Button onClick={() => setShowGenerate(true)}>Generate Key</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key: ApiKey) => (
                  <TableRow key={key.id}>
                    <TableCell><code className="text-sm">{maskApiKey(key.key)}</code></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(key.createDate)}</TableCell>
                    <TableCell className="text-sm">{key.expirationDate ? formatDate(key.expirationDate) : "Never"}</TableCell>
                    <TableCell className="text-sm">{key.apiCallsUsed} / {key.apiCallsLimit > 0 ? key.apiCallsLimit : "\u221E"}</TableCell>
                    <TableCell>
                      <Badge variant={key.active ? "success" : "destructive"}>
                        {key.active ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditKey(key)
                          setEditLimit(key.apiCallsLimit.toString())
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </Button>
                        {key.active && (
                          <Button variant="ghost" size="icon" onClick={() => handleRevoke(key.id)} disabled={revokeKey.isPending}>
                            <ToggleLeft className="h-4 w-4" />
                          </Button>
                        )}
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
