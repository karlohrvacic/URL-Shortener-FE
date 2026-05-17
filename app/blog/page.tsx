import { BlogPostCard } from "@/components/blog/blog-post-card"
import { PageMeta } from "@/components/page-meta"
import { blogPosts } from "@/content/blog/posts"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  return (
    <>
      <PageMeta
        title="Blog — hrva.cc"
        description="Articles about URL shortening, link management, analytics, and best practices from the hrva.cc team."
      />

      <div className="min-h-screen bg-background">
        {/* Nav */}
        <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <Link href="/" className="font-display text-lg tracking-tight text-foreground hover:text-primary transition-colors">
              hrva.cc
            </Link>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to app
            </Link>
          </div>
        </header>

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-14 space-y-4 animate-fade-up">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground tracking-wide uppercase">
                <BookOpen className="h-3.5 w-3.5" />
                Blog
              </div>
              <h1 className="font-display text-4xl md:text-5xl tracking-tight">
                Short links,<br />
                <span className="text-gradient-amber">sharp insights</span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                Articles about URL shortening, link management, analytics, security, and best practices — written by the team behind hrva.cc.
              </p>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {blogPosts.map((post, i) => (
                <BlogPostCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
