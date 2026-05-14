"use client"

import { useState } from "react"
import { authApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"
import { ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.requestPasswordReset({ email })
      setSent(true)
      toast.success("If the email exists, recovery instructions have been sent.")
    } catch (err: any) {
      toast.error(err.message || "Failed to request password reset")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageMeta title="Reset password" description="Reset your hrva.cc account password." />
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4 pt-24 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[100px] pointer-events-none" />
        <Card className="w-full max-w-sm relative glass border-border/40 animate-scale-in">
          <CardHeader className="text-center pb-2 pt-8">
            <h1 className="font-display text-2xl tracking-tight">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your email and we&apos;ll send you recovery instructions</p>
          </CardHeader>
          <CardContent className="pb-8 px-8">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400">
                  If an account with that email exists, we&apos;ve sent password reset instructions.
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
                  {loading ? "Sending…" : "Send reset instructions"}
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
