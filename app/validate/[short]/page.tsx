"use client"

import { use, useState, useEffect } from "react"
import { urlApi } from "@/lib/api-client"
import type { PeekUrl } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"
import { ExternalLink, Copy, Check, AlertCircle, ArrowLeft, Calendar, Search } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { formatDate, formatShortUrl } from "@/lib/utils"

export default function ValidateByShortPage({ params }: { params: Promise<{ short: string }> }) {
  const { short } = use(params)
  const [data, setData] = useState<PeekUrl | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<PeekUrl | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    if (!short) return
    setLoading(true)
    urlApi.peek(short)
      .then(setData)
      .catch((err) => setError(err.message || "URL not found"))
      .finally(() => setLoading(false))
  }, [short])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    setSearchLoading(true)
    setSearchError(null)
    setSearchResult(null)
    try {
      const result = await urlApi.peek(searchInput.trim())
      setSearchResult(result)
    } catch (err: any) {
      setSearchError(err.message || "URL not found")
    } finally {
      setSearchLoading(false)
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
      <PageMeta title={`URL /${short}`} description={`Look up where the short URL hrva.cc/${short} redirects to.`} />
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex items-start justify-center p-4 pt-24 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[100px] pointer-events-none" />
        <Card className="w-full max-w-lg relative glass border-border/40 animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Link href="/validate">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <CardTitle className="font-display text-lg tracking-tight">Validate URL</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inline reverse lookup */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Look up another short code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 h-10 bg-background/50 border-border/50 text-sm"
              />
              <Button type="submit" size="sm" disabled={searchLoading} className="h-10 bg-primary text-primary-foreground hover:brightness-110" >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </form>

            {searchLoading && <Skeleton className="h-10 w-full bg-muted/50" />}
            {searchError && <p className="text-sm text-destructive">{searchError}</p>}
            {searchResult && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20 text-sm">
                <span className="font-medium text-primary">/{searchResult.shortUrl}</span>
                <span className="truncate text-muted-foreground ml-2">{searchResult.longUrl}</span>
              </div>
            )}

            {/* Current URL result */}
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4 bg-muted/50" />
                <Skeleton className="h-4 w-full bg-muted/50" />
                <Skeleton className="h-4 w-1/2 bg-muted/50" />
              </div>
            ) : error ? (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="h-10 w-10 mx-auto text-destructive/60" />
                <h3 className="font-display text-lg tracking-tight">URL not found</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="border-border/50 text-xs">
                    Shorten a URL
                  </Button>
                </Link>
              </div>
            ) : data ? (
              <div className="space-y-4 rounded-lg border border-border/30 p-4 bg-background/50">
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground tracking-wide uppercase font-medium">Short URL</p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20">
                    <span className="text-sm font-medium text-primary">{formatShortUrl(data.shortUrl)}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formatShortUrl(data.shortUrl))} className="h-7 w-7">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground tracking-wide uppercase font-medium">Redirects to</p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20">
                    <span className="text-sm text-muted-foreground truncate">{data.longUrl}</span>
                    <a href={data.longUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created: {formatDate(data.createDate)}</span>
                </div>
                <a href={data.longUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-9 bg-primary text-primary-foreground hover:brightness-110 text-xs">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Visit URL
                  </Button>
                </a>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
