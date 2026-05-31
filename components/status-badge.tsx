import { Badge } from "@/components/ui/badge"
import { resolveStatus } from "@/lib/status"

interface StatusBadgeProps {
  status?: string
  active?: boolean
  className?: string
}

export function StatusBadge({ status, active, className }: StatusBadgeProps) {
  const { label, variant } = resolveStatus(status, active)
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
