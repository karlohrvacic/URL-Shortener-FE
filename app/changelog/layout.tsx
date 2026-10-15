import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Changelog",
  description: "Latest improvements, updates and fixes to the hrva.cc URL shortener.",
  alternates: { canonical: "https://app.hrva.cc/changelog" },
  openGraph: { url: "https://app.hrva.cc/changelog" },
}

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children
}
