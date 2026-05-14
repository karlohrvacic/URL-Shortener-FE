import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary">
          <span className="font-display text-3xl text-primary">404</span>
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-2xl tracking-tight">Page not found</h1>
          <p className="text-sm text-muted-foreground">This page doesn&apos;t exist or has been moved.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-9 px-5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:brightness-110 transition-all"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
