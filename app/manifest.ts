import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "hrva.cc — URL Shortener",
    short_name: "hrva.cc",
    description: "Shorten URLs, track visits, and manage your links with control and clarity.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#a67c00",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/favicon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  }
}
