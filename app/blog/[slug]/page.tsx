import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/content/blog/posts"
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} — hrva.cc Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight text-foreground hover:text-primary transition-colors">
            hrva.cc
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              All posts
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <article className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="mb-10 space-y-4 animate-fade-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span className="text-border/50">·</span>
              <span>{post.author}</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 border-border/30 text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="prose-custom animate-fade-up delay-100">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Pagination */}
          <nav className="mt-16 pt-8 border-t border-border/30 flex items-center justify-between gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground/60">Previous</span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{prevPost.title}</span>
                </span>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors text-right"
              >
                <span className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground/60">Next</span>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{nextPost.title}</span>
                </span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : <div />}
          </nav>
        </article>
      </main>
    </div>
  )
}
