"use client"

import { use, useState, useEffect } from "react"
import { urlApi } from "@/lib/api-client"
import type { PeekUrl } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { ExternalLink, Copy, Check, LinkIcon, AlertCircle, ArrowLeft, Calendar, Search } from "lucide-react"
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
              <Link href="/validate">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
              </Link>
              <CardTitle>Validate URL</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inline reverse lookup */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Look up another short code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={searchLoading}>
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {searchLoading && <Skeleton className="h-12 w-full" />}
            {searchError && <p className="text-sm text-destructive">{searchError}</p>}
            {searchResult && (
              <div className="text-sm p-3 bg-muted rounded-lg flex items-center justify-between">
                <span className="truncate font-medium">/{searchResult.shortUrl}</span>
                <span className="truncate text-muted-foreground ml-2">{searchResult.longUrl}</span>
              </div>
            )}

            {/* Current URL result */}
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : error ? (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                <h3 className="text-lg font-semibold">URL not found</h3>
                <p className="text-muted-foreground">{error}</p>
                <Link href="/">
                  <Button variant="outline">Shorten a URL</Button>
                </Link>
              </div>
            ) : data ? (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Short URL</p>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{formatShortUrl(data.shortUrl)}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formatShortUrl(data.shortUrl))}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Redirects to</p>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
