import type { Metadata } from "next"
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { Providers } from "./providers"
import { JsonLd } from "@/components/json-ld"

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
})

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const baseUrl = "https://hrva.cc"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "hrva.cc — short links, shaped by you",
    template: "%s — hrva.cc",
  },
  description:
    "Shorten URLs, track visits, and manage your links with control and clarity. Free URL shortener with analytics, expiration control, and safe browsing checks.",
  keywords: [
    "URL shortener",
    "link shortener",
    "short links",
    "link management",
    "URL analytics",
    "hrva.cc",
    "free URL shortener",
  ],
  authors: [{ name: "hrva.cc" }],
  creator: "hrva.cc",
  publisher: "hrva.cc",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "hrva.cc",
    url: baseUrl,
    title: "hrva.cc — short links, shaped by you",
    description:
      "Shorten URLs, track visits, and manage your links with control and clarity. Free URL shortener with analytics, expiration control, and safe browsing checks.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "hrva.cc — short links, shaped by you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "hrva.cc — short links, shaped by you",
    description:
      "Shorten URLs, track visits, and manage your links with control and clarity.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "hrva.cc",
    statusBarStyle: "black-translucent",
  },
  category: "technology",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <div className="noise-bg" />
        <Providers>{children}</Providers>
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
        <JsonLd />
      </body>
    </html>
  )
}
