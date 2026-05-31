"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { urlApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"
import { Lock } from "lucide-react"

export default function ProtectedLinkPage() {
  const params = useParams()
  const short = params.short as string
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await urlApi.unlock(short, password)
      window.location.href = res.longUrl
    } catch (err: any) {
      setError(err?.message || "Incorrect password")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <PageMeta title="Protected link" description="This link is password protected." />
      <Card className="w-full max-w-sm relative glass border-border/40 animate-scale-in">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-4"><Logo /></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary mx-auto mb-2">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <h1 className="font-display text-xl tracking-tight">Protected link</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the password to continue</p>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus className="h-10 bg-background/50 border-border/50" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground hover:brightness-110" disabled={loading || !password}>
              {loading ? "Unlocking…" : "Unlock & continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
