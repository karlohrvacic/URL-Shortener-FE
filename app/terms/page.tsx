import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Use — hrva.cc",
  description:
    "Terms of use for hrva.cc: a free, non-commercial URL shortener provided as is, without warranties.",
  openGraph: {
    title: "Terms of Use — hrva.cc",
    description:
      "Terms of use for hrva.cc: a free, non-commercial URL shortener provided as is, without warranties.",
  },
}

const LAST_UPDATED = "June 10, 2026"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight text-foreground hover:text-primary transition-colors">
            hrva.cc
          </Link>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to app
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <article className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-10 space-y-4 animate-fade-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-wide uppercase">
              <Scale className="h-3.5 w-3.5" />
              Terms
            </div>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-tight">
              Terms of Use
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Last updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Content */}
          <div className="prose-custom animate-fade-up delay-100">
            <p className="lead">
              In short: hrva.cc is a free, non-commercial hobby project. It is provided as is,
              with no guarantees. You are responsible for the links you create and for what you
              do with the service.
            </p>

            <h2>The service</h2>
            <p>
              hrva.cc is a URL-shortening service and a hobby project of{" "}
              <a href="https://hrva.cc" target="_blank" rel="noopener noreferrer">HrvaLabs.net</a>,
              operated by Karlo Hrvačić. It is offered free of charge, for personal and
              non-critical use. By using the service or creating an account you accept these
              terms.
            </p>

            <h2>No warranty, no liability</h2>
            <p>
              The service is provided <strong>as is</strong> and <strong>as available</strong>,
              without warranties of any kind — no guaranteed uptime, durability of links, accuracy
              of statistics, or fitness for any particular purpose. Links, accounts, or the entire
              service may change, break, or be discontinued at any time without notice. To the
              maximum extent permitted by law, the operator accepts no liability for any damage
              arising from the use of, or inability to use, the service. Do not rely on hrva.cc
              for anything critical.
            </p>

            <h2>Your responsibility</h2>
            <p>
              You are solely responsible for the URLs you shorten, the content they lead to, and
              anywhere you share them. Shortening a URL does not change who is responsible for the
              destination content — that remains you and the destination site, never the operator
              of this service.
            </p>

            <h2>Acceptable use</h2>
            <p>It is not allowed to use the service to link to or facilitate:</p>
            <ul>
              <li>malware, phishing, or other fraudulent or harmful content,</li>
              <li>content that is illegal in Croatia or the European Union,</li>
              <li>spam or abusive automated traffic that degrades the service for others.</li>
            </ul>
            <p>
              Destination URLs are screened with Google Safe Browsing, and links or accounts that
              violate these rules may be disabled or deleted at any time, without notice and at
              the operator&apos;s sole discretion.
            </p>

            <h2>Accounts</h2>
            <p>
              Keep your credentials to yourself; you are responsible for activity under your
              account. Unused accounts may be deactivated automatically. You can delete your
              account at any time, which removes your data as described in the{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </p>

            <h2>Changes</h2>
            <p>
              These terms may change as the project evolves. The current version is always on this
              page, with the date above. Continued use of the service after a change means you
              accept the updated terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href="mailto:privacy@hrvalabs.net">privacy@hrvalabs.net</a>.
            </p>
          </div>
        </article>
      </main>
    </div>
  )
}
