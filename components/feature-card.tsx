import type React from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_30px_hsl(38_92%_50%_/_0.06)]">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-primary mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
