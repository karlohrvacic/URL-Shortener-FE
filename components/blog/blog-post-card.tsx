import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar } from "lucide-react"
import type { BlogPost } from "@/content/blog/posts"

export function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group animate-fade-up px-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <article className="rounded-xl border border-border/40 bg-card/50 p-6 transition-all duration-300 hover:border-primary/20 hover:bg-card/80 hover:shadow-sm hover:shadow-primary/5">
        <div className="flex flex-col gap-3">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-border/50">·</span>
            <span>{post.author}</span>
          </div>

          {/* Title */}
          <h2 className="font-display text-xl md:text-2xl tracking-tight group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {/* Tags + Read more */}
          <div className="flex items-center justify-between gap-4 mt-1">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5 border-border/30 text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
              Read more <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
