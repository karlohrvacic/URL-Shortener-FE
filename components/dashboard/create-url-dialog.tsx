"use client"

import { useState } from "react"
import { useCreateUrl } from "@/lib/hooks/useUrls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Check } from "lucide-react"
import { getShortBaseUrl } from "@/lib/utils"

interface CreateUrlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUrlDialog({ open, onOpenChange }: CreateUrlDialogProps) {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [visitLimit, setVisitLimit] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [result, setResult] = useState<{ shortUrl: string; longUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const createUrl = useCreateUrl()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!longUrl) return
    const expDate = expirationDate ? new Date(expirationDate).toISOString() : undefined
    try {
      const url = await createUrl.mutateAsync({
        longUrl,
        shortUrl: customAlias || undefined,
        visitLimit: visitLimit ? parseInt(visitLimit) : undefined,
        expirationDate: expDate,
      })
      setResult({ shortUrl: url.shortUrl, longUrl: url.longUrl })
      toast.success("URL shortened!")
    } catch (err: any) {
      toast.error(err.message || "Failed to create URL")
    }
  }

  const handleClose = () => {
    setLongUrl("")
    setCustomAlias("")
    setVisitLimit("")
    setExpirationDate("")
    setResult(null)
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{result ? "URL Created!" : "Create Short URL"}</DialogTitle>
          {!result && <DialogDescription>Enter a long URL to shorten it.</DialogDescription>}
        </DialogHeader>
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Long URL</Label>
              <Input placeholder="https://example.com/very/long/url" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Custom alias (optional)</Label>
              <Input placeholder="my-link" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Visit limit (optional)</Label>
              <Input type="number" placeholder="e.g. 100" value={visitLimit} onChange={(e) => setVisitLimit(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expiration date (optional)</Label>
              <Input type="datetime-local" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={createUrl.isPending}>
              {createUrl.isPending ? "Shortening..." : "Shorten"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">/{result.shortUrl}</span>
              <Button variant="ghost" size="icon" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${result.shortUrl}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                toast.success("Copied!")
              }}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-center">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg inline-block">
                <QRCodeSVG value={`${getShortBaseUrl()}/${result.shortUrl}`} size={150} />
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleClose}>Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
