"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { authApi } from "@/lib/api-client"
import { Logo } from "@/components/logo"
import { PageMeta } from "@/components/page-meta"

type State = "loading" | "success" | "error"

export default function VerifyEmailPage() {
  const params = useParams()
  const token = params.token as string
  const [state, setState] = useState<State>("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setState("error")
      setMessage("Invalid verification link.")
      return
    }
    authApi
      .verifyEmail(token)
      .then(() => setState("success"))
      .catch((err: any) => {
        setState("error")
        setMessage(err?.message || "Verification failed.")
      })
  }, [token])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <PageMeta title="Verify email" description="Verify your hrva.cc email address." />
      <div className="w-full max-w-sm text-center space-y-6">
        <Logo />

        {state === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-7 w-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Verifying your email…</span>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="font-display text-2xl tracking-tight">Email verified</h1>
              <p className="text-sm text-muted-foreground">Your account is now active. You can sign in.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              Go to sign in
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="font-display text-2xl tracking-tight">Verification failed</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <Link
              href="/verify-email/resend"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md border border-border/50 text-sm font-medium hover:bg-muted/40 transition-colors"
            >
              Resend verification email
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
