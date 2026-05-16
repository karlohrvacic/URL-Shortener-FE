import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

const fortunes = [
  "Your next short link will be clicked 42 times.",
  "A custom alias is in your near future.",
  "The QR code whispers wisdom. Scan wisely.",
  "You will soon receive a visit from a long-lost URL.",
  "Beware of broken links — they lead nowhere good.",
  "A link shortened today saves nine tomorrow.",
  "The analytics dashboard sees all. It has judged you favorably.",
  "An expired link awaits reactivation.",
  "Your API key will go further than you think.",
  "The one who shortens the most links wins at life.",
  "A mysterious visitor from a faraway IP shall click your link.",
  "To shorten is divine. To track, even more so.",
  "The URL you seek is hidden in plain sight.",
  "Great power comes with great short URLs.",
  "404 not found — said no fortune ever.",
  "Clickbait is not your destiny. You are better than that.",
  "A wild QR code appears! It leads to a place of wonder.",
  "Your visit limit approaches. Use your clicks wisely.",
  "Sharing is caring. Shortening is loving.",
  "The link chooses the clicker, Mr. Anderson.",
]

export default function FortunePage() {
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageMeta title="URL Fortune — hrva.cc" description="Your URL fortune awaits." />

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
          <Badge variant="outline" className="text-xs px-3 py-1 tracking-wider uppercase border-primary/20 text-primary">
            🔮 URL Fortune
          </Badge>

          <Card className="glass-strong glow-amber-sm border-border/50">
            <CardContent className="p-8">
              <div className="text-5xl mb-6">🥠</div>
              <p className="text-lg md:text-xl text-foreground font-display tracking-tight leading-relaxed">
                &ldquo;{fortune}&rdquo;
              </p>
            </CardContent>
          </Card>

          <a href="/fortune">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-border/50">
              <RefreshCw className="h-3.5 w-3.5" />
              Another fortune
            </Button>
          </a>
        </div>
      </main>
    </div>
  )
}
