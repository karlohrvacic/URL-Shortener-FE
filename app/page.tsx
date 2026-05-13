"use client"

import { useState } from "react"
import { useCreateUrl } from "@/lib/hooks/useUrls"
import type { Url } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeatureCard } from "@/components/feature-card"
import { LinkIcon, BarChart3, Shield, Copy, Check, ExternalLink, Clock, Zap, Github, BookOpen } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { formatShortUrl } from "@/lib/utils"

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [visitLimit, setVisitLimit] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [result, setResult] = useState<Url | null>(null)
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const createUrl = useCreateUrl()
  const { user } = useAuth()

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
      setResult(url)
      toast.success("URL shortened!")
    } catch (err: any) {
      toast.error(err.message || "Failed to shorten URL")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied to clipboard!")
  }

  const features = [
    { icon: <Zap className="h-6 w-6" />, title: "Lightning Fast", description: "Shorten URLs in milliseconds with our optimized service." },
    { icon: <BarChart3 className="h-6 w-6" />, title: "Track Visits", description: "Monitor how many times your shortened URLs are accessed." },
    { icon: <Clock className="h-6 w-6" />, title: "Expiration Control", description: "Set visit limits and expiration dates for your links." },
    { icon: <Shield className="h-6 w-6" />, title: "Safe Browsing", description: "URLs are automatically checked against Google Safe Browsing." },
  ]

  const shortUrlDisplay = result ? formatShortUrl(result.shortUrl) : ""

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">hrva.cc</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-1">Free URL Shortener</Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Shorten URLs,{" "}
                <span className="text-primary">not your reach</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Create short, memorable links that you can track, manage, and control.
                Set expiration dates, visit limits, and monitor analytics.
              </p>
            </div>

            {/* URL Shortener */}
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Paste your long URL here..."
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      className="flex-1 h-12 text-base"
                      required
                    />
                    <Button type="submit" size="lg" className="h-12 px-8" disabled={createUrl.isPending}>
                      {createUrl.isPending ? "Shortening..." : "Shorten"}
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showOptions ? "Hide" : "Show"} advanced options
                  </button>

                  {showOptions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Custom alias (optional)</label>
                        <Input
                          placeholder="my-custom-link"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Visit limit (optional)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 100"
                          value={visitLimit}
                          onChange={(e) => setVisitLimit(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiration date</label>
                        <Input
                          type="datetime-local"
                          value={expirationDate}
                          onChange={(e) => setExpirationDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </form>

                {result && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{shortUrlDisplay}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.longUrl}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(shortUrlDisplay)}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <a href={result.longUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    <div className="flex justify-center pt-2">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-lg inline-block">
                        <QRCodeSVG value={shortUrlDisplay} size={120} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why use hrva.cc?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your links in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} hrva.cc</p>
            <div className="flex items-center gap-4">
              <Link href="/validate" className="hover:text-primary transition-colors">Validate</Link>
              <a href="https://hrva.cc/swagger-ui/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> API
              </a>
              <a href="https://github.com/karlohrvacic/url-shortener" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                <Github className="h-3 w-3" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
