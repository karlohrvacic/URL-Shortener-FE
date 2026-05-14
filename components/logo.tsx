import Link from "next/link"

interface LogoProps {
  showText?: boolean
  href?: string
  className?: string
}

export function Logo({ showText = true, href = "/", className = "" }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Back link (horizontal, rotated -30°) */}
        <g transform="translate(18,18) rotate(-25) translate(-18,-18)">
          <rect
            x="4"
            y="14"
            width="28"
            height="8"
            rx="4"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-primary transition-all duration-300 group-hover:opacity-80"
          />
        </g>
        {/* Front link (vertical, rotated +30°) */}
        <g transform="translate(18,18) rotate(25) translate(-18,-18)">
          <rect
            x="14"
            y="4"
            width="8"
            height="28"
            rx="4"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            className="text-primary/40 transition-all duration-300 group-hover:opacity-70"
          />
        </g>
      </svg>
      {showText && (
        <span className="font-bold text-lg tracking-tight transition-transform duration-300 group-hover:translate-x-[1px]">
          hrva.cc
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
