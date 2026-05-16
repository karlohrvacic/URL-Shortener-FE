"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"
import {
  ArrowLeft, Sparkles, Rocket, Shield, Zap, TestTube, Wrench,
  Search, Lock, Gauge, Repeat, Bug, Paintbrush, Layers, LinkIcon,
  BarChart3, Key, Clock, Users, Cloud, Database, Globe, AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface ChangelogItem {
  title: string
  icon: string
  description?: string
  items: string[]
}

interface Release {
  version: string
  date?: string
  badge: string
  badgeVariant: "default" | "secondary" | "outline"
  summary: string
  sections: ChangelogItem[]
}

interface ChangelogData {
  releases: Release[]
}

const iconMap: Record<string, React.ReactNode> = {
  search: <Search className="h-4 w-4" />,
  layers: <Layers className="h-4 w-4" />,
  paintbrush: <Paintbrush className="h-4 w-4" />,
  bug: <Bug className="h-4 w-4" />,
  "test-tube": <TestTube className="h-4 w-4" />,
  sparkles: <Sparkles className="h-4 w-4" />,
  rocket: <Rocket className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  wrench: <Wrench className="h-4 w-4" />,
  repeat: <Repeat className="h-4 w-4" />,
  lock: <Lock className="h-4 w-4" />,
  gauge: <Gauge className="h-4 w-4" />,
  "bar-chart": <BarChart3 className="h-4 w-4" />,
  key: <Key className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
  cloud: <Cloud className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  globe: <Globe className="h-4 w-4" />,
  link: <LinkIcon className="h-4 w-4" />,
}

function getIcon(iconName: string): React.ReactNode {
  return iconMap[iconName] ?? <Sparkles className="h-4 w-4" />
}

export default function ChangelogPage() {
  const [data, setData] = useState<ChangelogData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/v1/changelog")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load changelog (${res.status})`)
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageMeta title="Changelog — hrva.cc" description="What's new in hrva.cc URL shortener." />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-3 animate-fade-up">
            <Badge variant="outline" className="text-xs px-3 py-1 tracking-wider uppercase border-primary/20 text-primary">
              hrva.cc
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight">Changelog</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Every release, feature, and fix for hrva.cc.
            </p>
          </div>

          {error && (
            <Card className="border-destructive/30 bg-destructive/5 mb-8">
              <CardContent className="p-4 flex items-center gap-3 text-sm">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <span className="text-muted-foreground">Failed to load changelog: {error}</span>
              </CardContent>
            </Card>
          )}

          {/* Loading */}
          {!data && !error && (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="ml-14 space-y-3">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          {data && (
            <div className="relative space-y-10">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-8 bottom-0 w-px bg-border/50 hidden md:block" />

              {data.releases.map((release) => (
                <div key={release.version} className="relative animate-fade-up">
                  {/* Release header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary tabular-nums">
                        {release.version === "Pre-release" ? "α" : release.version.startsWith("v") ? release.version.replace("v", "") : "~"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display text-xl tracking-tight">{release.version}</h2>
                        <Badge variant={release.badgeVariant as "default" | "secondary" | "outline"} className="text-[10px] px-2 py-0.5 tracking-wider uppercase">
                          {release.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{release.date}</p>
                      <p className="text-sm text-muted-foreground">{release.summary}</p>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="md:ml-14 space-y-3">
                    {release.sections.map((section) => (
                      <Card key={section.title} className="border-border/40 bg-card/50">
                        <CardContent className="p-5">
                          <h3 className="text-sm font-semibold tracking-tight mb-1 flex items-center gap-2">
                            <span className="text-primary shrink-0">{getIcon(section.icon)}</span>
                            {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-xs text-muted-foreground mb-3 ml-6">{section.description}</p>
                          )}
                          <ul className="space-y-1.5">
                            {section.items.map((item) => (
                              <li key={item} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2.5">
                                <span className="text-primary/60 mt-[7px] h-1 w-1 rounded-full bg-primary/40 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer note */}
          {data && (
            <div className="text-center mt-16 text-xs text-muted-foreground space-y-1">
              <p className="font-mono">149 tests · {data.releases.length} releases · 1 URL shortener</p>
              <p className="group cursor-default">
                hrva.cc —
                <span className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">&#x1F648;</span>
                {" "}shaped by you.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
