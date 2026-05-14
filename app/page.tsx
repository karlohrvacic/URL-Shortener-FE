"use client"

import { useState } from "react"
import { useCreateUrl, useMyUrls } from "@/lib/hooks/useUrls"
import type { Url } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeatureCard } from "@/components/feature-card"
import { Logo } from "@/components/logo"
import {
  LinkIcon, BarChart3, Shield, Copy, Check, ExternalLink,
  Clock, Zap, Globe, BookOpen, ChevronDown, ChevronUp,
  ArrowRight, Plus, Sparkles,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { formatShortUrl, formatDate, truncateUrl } from "@/lib/utils"

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
  const { data: recentUrls } = useMyUrls()

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

  const shortUrlDisplay = result ? formatShortUrl(result.shortUrl) : ""

  const features = [
    { icon: <Zap className="h-5 w-5" />, title: "Lightning Fast", description: "Shorten URLs in milliseconds with our optimized edge service." },
    { icon: <BarChart3 className="h-5 w-5" />, title: "Track Visits", description: "Monitor every click with real-time analytics on your links." },
    { icon: <Clock className="h-5 w-5" />, title: "Expiration Control", description: "Set visit limits and expiration dates — total control." },
    { icon: <Shield className="h-5 w-5" />, title: "Safe Browsing", description: "Every URL is checked against Google Safe Browsing." },
  ]

  // Stats for logged-in user
  const totalUrls = recentUrls?.length ?? 0
  const totalVisits = recentUrls?.reduce((sum, u) => sum + u.visits, 0) ?? 0
  const latestUrls = recentUrls?.slice(0, 5) ?? []

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="h-9 bg-primary text-primary-foreground hover:brightness-110">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {user ? (
        /* ── LOGGED-IN EXPERIENCE ── */
        <>
          <section className="relative pt-24 pb-12 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/4 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4">
              {/* Greeting + stats row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-up">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Welcome back
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl tracking-tight">
                    Shorten something
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="font-display text-2xl tabular-nums text-primary">{totalUrls}</span>
                    <p className="text-[11px] text-muted-foreground tracking-wide uppercase mt-0.5">Links</p>
                  </div>
                  <div className="w-px h-10 bg-border/50" />
                  <div className="text-center">
                    <span className="font-display text-2xl tabular-nums text-primary">{totalVisits.toLocaleString()}</span>
                    <p className="text-[11px] text-muted-foreground tracking-wide uppercase mt-0.5">Visits</p>
                  </div>
                  <div className="w-px h-10 bg-border/50" />
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="h-9 gap-1.5 border-border/50 text-xs">
                      View all
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick shorten card - spans 2 cols */}
                <div className="lg:col-span-2 animate-fade-up delay-100">
                  <Card className="glass-strong glow-amber-sm border-border/50 h-full">
                    <CardContent className="p-6">
                      <h2 className="text-sm font-semibold tracking-tight mb-4 flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        New short link
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Paste your long URL..."
                              value={longUrl}
                              onChange={(e) => setLongUrl(e.target.value)}
                              className="h-11 pl-9 text-sm bg-background/50 border-border/50 focus:border-primary/50"
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="h-11 px-6 bg-primary text-primary-foreground hover:brightness-110 text-sm shrink-0"
                            disabled={createUrl.isPending}
                          >
                            {createUrl.isPending ? "Shortening…" : "Shorten"}
                          </Button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowOptions(!showOptions)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ChevronDown className={`h-3 w-3 transition-transform ${showOptions ? "rotate-180" : ""}`} />
                          {showOptions ? "Hide" : "Show"} advanced options
                        </button>

                        {showOptions && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Alias</label>
                              <Input placeholder="custom-link" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} className="h-9 text-sm bg-background/50 border-border/50" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Visit limit</label>
                              <Input type="number" placeholder="e.g. 100" value={visitLimit} onChange={(e) => setVisitLimit(e.target.value)} className="h-9 text-sm bg-background/50 border-border/50" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Expires at</label>
                              <Input type="datetime-local" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="h-9 text-sm bg-background/50 border-border/50" />
                            </div>
                          </div>
                        )}
                      </form>

                      {/* Result inline */}
                      {result && (
                        <div className="mt-4 pt-4 border-t border-border/40 space-y-3 animate-scale-in">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary truncate">{shortUrlDisplay}</p>
                              <p className="text-xs text-muted-foreground truncate">{result.longUrl}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-3 shrink-0">
                              <button onClick={() => copyToClipboard(shortUrlDisplay)} className="p-1.5 hover:bg-muted rounded transition-colors">
                                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                              <a href={result.longUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted rounded transition-colors">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className="p-3 rounded-xl bg-background/50 border border-border/30">
                              <QRCodeSVG value={shortUrlDisplay} size={100} fgColor="#a67c00" bgColor="transparent" level="M" />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent URLs sidebar */}
                <div className="animate-fade-up delay-200">
                  <Card className="glass-strong border-border/50 h-full">
                    <CardContent className="p-6">
                      <h2 className="text-sm font-semibold tracking-tight mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Recent links
                      </h2>

                      {latestUrls.length === 0 ? (
                        <div className="text-center py-8">
                          <LinkIcon className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
                          <p className="text-xs text-muted-foreground">No links yet — shorten your first one!</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {latestUrls.map((url) => (
                            <div
                              key={url.id}
                              className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
                              onClick={() => copyToClipboard(formatShortUrl(url.shortUrl))}
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-primary truncate group-hover:underline">
                                  /{url.shortUrl}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                  {truncateUrl(url.longUrl, 35)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-2 shrink-0">
                                <span className="text-[11px] tabular-nums text-muted-foreground">{url.visits}</span>
                                <Copy className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {latestUrls.length > 0 && (
                        <Link
                          href="/dashboard"
                          className="flex items-center justify-center gap-1 mt-4 pt-3 border-t border-border/30 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          View all links
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* ── PUBLIC LANDING ── */
        <>
          {/* Hero */}
          <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 py-20 md:py-28">
              <div className="max-w-3xl mx-auto text-center space-y-10">
                <div className="animate-fade-up">
                  <Badge variant="outline" className="text-xs px-3 py-1 tracking-wider uppercase border-primary/20 text-primary">
                    Free URL Shortener
                  </Badge>
                </div>

                <div className="space-y-4 animate-fade-up delay-100">
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight">
                    Short links,
                    <br />
                    <span className="text-gradient-amber">shaped by you</span>
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Create short, trackable links that you control — with visit limits,
                    expiration dates, and analytics at your fingertips.
                  </p>
                </div>

                <div className="animate-fade-up delay-200">
                  <Card className="glass-strong glow-amber border-border/50">
                    <CardContent className="p-6 md:p-8">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Paste your long URL here..."
                              value={longUrl}
                              onChange={(e) => setLongUrl(e.target.value)}
                              className="h-12 pl-10 text-base bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            size="lg"
                            className="h-12 px-8 bg-primary text-primary-foreground hover:brightness-110 font-medium"
                            disabled={createUrl.isPending}
                          >
                            {createUrl.isPending ? "Shortening…" : "Shorten"}
                          </Button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowOptions(!showOptions)}
                          className="flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showOptions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          {showOptions ? "Hide" : "Show"} advanced options
                        </button>

                        {showOptions && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 animate-fade-in">
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Custom alias</label>
                              <Input placeholder="my-custom-link" value={customAlias} onChange={(e) => setCustomAlias(e.target.value)} className="h-10 bg-background/50 border-border/50 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Visit limit</label>
                              <Input type="number" placeholder="e.g. 100" value={visitLimit} onChange={(e) => setVisitLimit(e.target.value)} className="h-10 bg-background/50 border-border/50 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Expires at</label>
                              <Input type="datetime-local" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="h-10 bg-background/50 border-border/50 text-sm" />
                            </div>
                          </div>
                        )}
                      </form>

                      {result && (
                        <div className="mt-6 pt-6 border-t border-border/50 space-y-5 animate-scale-in">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-primary truncate">{shortUrlDisplay}</p>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{result.longUrl}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-4 shrink-0">
                              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(shortUrlDisplay)} className="h-8 w-8">
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                              <a href={result.longUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-3">
                            <div className="relative p-4 rounded-xl bg-background/50 border border-border/30">
                              <div className="absolute inset-0 rounded-xl bg-primary/5" />
                              <div className="relative">
                                <QRCodeSVG value={shortUrlDisplay} size={140} fgColor="#a67c00" bgColor="transparent" level="M" />
                              </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Scan to visit</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="relative border-t border-border/50 py-24">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 space-y-3">
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Why hrva.cc</span>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight">Control, meet simplicity</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  Everything you need to manage your links — nothing you don&apos;t.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {features.map((feature, i) => (
                  <div key={feature.title} style={{ animationDelay: `${(i + 1) * 100}ms` }} className="animate-fade-up">
                    <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="relative border-t border-border/50 py-24" itemScope itemType="https://schema.org/FAQPage">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-14 space-y-3">
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">FAQ</span>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight">Frequently asked questions</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  Everything you need to know about hrva.cc.
                </p>
              </div>
              <div className="space-y-3" itemScope itemType="https://schema.org/Question">
                <details className="group rounded-xl border border-border/40 bg-background/30 p-5 open:bg-background/50 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-display text-base md:text-lg tracking-tight pr-4" itemProp="name">How do I shorten a URL?</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">Paste your long URL into the input field on the hrva.cc homepage and click <strong>Shorten</strong>. You can optionally set a custom alias, visit limit, or expiration date before shortening. No account required for basic use.</p>
                  </div>
                </details>

                <details className="group rounded-xl border border-border/40 bg-background/30 p-5 open:bg-background/50 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-display text-base md:text-lg tracking-tight pr-4" itemProp="name">Is hrva.cc free to use?</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">Yes, hrva.cc is completely free to use. You can shorten URLs, set visit limits and expiration dates, and track analytics without any cost. Creating an account unlocks additional features like link management and detailed analytics.</p>
                  </div>
                </details>

                <details className="group rounded-xl border border-border/40 bg-background/30 p-5 open:bg-background/50 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-display text-base md:text-lg tracking-tight pr-4" itemProp="name">Can I track how many people clicked my link?</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">Yes. Creating a free account gives you access to click analytics for every link you shorten, including total visit counts and per-link performance data. You can view all your links and their analytics from your dashboard.</p>
                  </div>
                </details>

                <details className="group rounded-xl border border-border/40 bg-background/30 p-5 open:bg-background/50 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-display text-base md:text-lg tracking-tight pr-4" itemProp="name">How do expiration dates and visit limits work?</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">When shortening a URL, you can optionally set a <strong>visit limit</strong> (the link stops working after N visits) or an <strong>expiration date</strong> (the link expires at a specific time). Both features give you full control over your links.</p>
                  </div>
                </details>

                <details className="group rounded-xl border border-border/40 bg-background/30 p-5 open:bg-background/50 transition-all">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-display text-base md:text-lg tracking-tight pr-4" itemProp="name">What is a URL shortener used for?</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed" itemScope itemType="https://schema.org/Answer">
                    <p itemProp="text">A URL shortener converts long web addresses into short, shareable links. They are commonly used on social media, in emails, and in marketing campaigns to make links cleaner, trackable, and easier to manage.</p>
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative border-t border-border/50 py-24">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px] pointer-events-none" />
            <div className="container mx-auto px-4 text-center relative">
              <div className="max-w-lg mx-auto space-y-6">
                <h2 className="font-display text-3xl md:text-4xl tracking-tight">Ready to simplify your links?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Create an account to track analytics, manage all your links in one place, and unlock advanced features.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link href="/register">
                    <Button size="lg" className="h-11 px-7 bg-primary text-primary-foreground hover:brightness-110">
                      Get started free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="h-11 px-7 border-border/50">
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Divider ── */}
      <div className="divider-amber mx-auto w-3/4" />

      {/* ── Footer ── */}
      <footer className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <Logo showText href="/" />
            <div className="flex items-center gap-6">
              <Link href="/validate" className="hover:text-foreground transition-colors">
                Validate
              </Link>
              <a href="https://hrva.cc/swagger-ui/index.html" target="_blank" rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <BookOpen className="h-3 w-3" /> API
              </a>
              <a href="https://github.com/karlohrvacic/url-shortener" target="_blank" rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
