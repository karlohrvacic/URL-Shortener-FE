"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"
import { ArrowLeft, Volume2, QrCode } from "lucide-react"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"

const quacks = [
  "🦆 Quack!",
  "🦆 Quack quack!",
  "🦆 QUACK!",
  "🦆 ...quack?",
  "🦆 Quack quack quack!",
  "🦆  quaaack  ",
  "🦆   ",
  "🦆 Q-U-A-C-K.",
  "🦆 ^\u00B7\u1361\u00B7^",
]

export default function EggPage() {
  const [quackIndex, setQuackIndex] = useState(0)
  const [showQr, setShowQr] = useState(false)
  const [count, setCount] = useState(0)

  const handleQuack = () => {
    setQuackIndex((prev) => (prev + 1) % quacks.length)
    setCount((prev) => prev + 1)

    if (count >= 9) {
      setShowQr(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageMeta title="🥚 — hrva.cc" description="You found it." />

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

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 text-center animate-fade-up">
          <Badge variant="outline" className="text-xs px-3 py-1 tracking-wider uppercase border-amber-500/30 text-amber-500">
            🥚 You found it!
          </Badge>

          {/* Duck */}
          <div className="text-[96px] leading-none select-none animate-bounce">
            🦆
          </div>

          {/* Quack button */}
          <Card className="glass-strong glow-amber-sm border-border/50">
            <CardContent className="p-6 space-y-4">
              <p className="text-2xl font-display tracking-tight min-h-[3rem]">
                {quacks[quackIndex]}
              </p>
              <Button
                onClick={handleQuack}
                size="lg"
                className="h-12 px-8 gap-2 bg-primary text-primary-foreground hover:brightness-110"
              >
                <Volume2 className="h-4 w-4" />
                Quack
              </Button>

              {showQr && (
                <div className="pt-4 border-t border-border/30 space-y-3 animate-scale-in">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <QrCode className="h-3.5 w-3.5" />
                    You earned a surprise!
                  </div>
                  <div className="flex justify-center">
                    <div className="p-3 rounded-xl bg-white">
                      <QRCodeSVG value="https://www.youtube.com/watch?v=dQw4w9WgXcQ" size={140} fgColor="#000" bgColor="transparent" level="M" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Quack {count + 1} time{count !== 0 ? "s" : ""}
          </p>
        </div>
      </main>
    </div>
  )
}
