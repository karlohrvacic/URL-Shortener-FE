"use client"

import { useState } from "react"
import { urlApi } from "@/lib/api-client"
import type { PeekUrl } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { ExternalLink, Copy, Check, LinkIcon, AlertCircle, ArrowLeft, Calendar, Search } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { formatDate, formatShortUrl } from "@/lib/utils"

export default function ValidatePage() {
  const [shortCode, setShortCode] = useState("")
  const [data, setData] = useState<PeekUrl | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shortCode.trim()) return
    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const result = await urlApi.peek(shortCode.trim())
      setData(result)
    } catch (err: any) {
      setError(err.message || "URL not found")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied!")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">hrva.cc</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex items-start justify-center p-4 pt-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
              </Link>
              <div>
                <CardTitle>Validate a short URL</CardTitle>
                <CardDescription>Enter a short code to see where it redirects</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Enter short code (e.g. abc123)"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Lookup
              </Button>
            </form>

            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {error && searched && !loading && (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <h3 className="text-lg font-semibold">URL not found</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            )}

            {data && !loading && (
              <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Short URL</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{formatShortUrl(data.shortUrl)}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formatShortUrl(data.shortUrl))}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Redirects to</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{data.longUrl}</span>
                    <a href={data.longUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(data.createDate)}</span>
                </div>
                <a href={data.longUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit URL
                  </Button>
                </a>
              </div>
            )}

            {!searched && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter a short code above to check where it redirects</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
