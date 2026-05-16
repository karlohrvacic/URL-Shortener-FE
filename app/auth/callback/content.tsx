"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"

export function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    const err = searchParams.get("error")

    if (token) {
      localStorage.setItem("auth-token", `Bearer ${token}`)
      router.push("/dashboard")
    } else if (err) {
      setError(err === "no_email" ? "Could not retrieve email from provider." : "Authentication failed.")
    } else {
      setError("Invalid callback — no token received.")
    }
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <Logo />
          <div className="space-y-2">
            <h1 className="font-display text-2xl tracking-tight">Authentication failed</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
          >
            Try again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-7 w-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <span className="text-sm text-muted-foreground">Signing you in…</span>
      </div>
    </div>
  )
}
