"use client"

import { useState } from "react"
import Link from "next/link"
import { authApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageMeta } from "@/components/page-meta"

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.resendVerification(email)
      setSent(true)
      toast.success("If the account exists and is unverified, a new link has been sent.")
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta title="Resend verification" description="Resend your hrva.cc email verification link." />
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4 pt-24 relative">
        <Card className="w-full max-w-sm relative glass border-border/40 animate-scale-in">
          <CardHeader className="text-center pb-2 pt-8">
            <h1 className="font-display text-2xl tracking-tight">Resend verification</h1>
            <p className="text-sm text-muted-foreground mt-1">We&apos;ll email you a fresh verification link</p>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                  If an unverified account exists for that email, a new verification link is on its way.
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-10 border-border/50" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-10 bg-background/50 border-border/50" />
                </div>
                <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground hover:brightness-110" disabled={loading}>
                  {loading ? "Sending…" : "Resend verification link"}
                </Button>
                <Link href="/login" className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
