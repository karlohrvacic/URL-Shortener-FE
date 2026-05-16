"use client"

import { Suspense } from "react"
import { AuthCallbackContent } from "./content"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-7 w-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Signing you in…</span>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
