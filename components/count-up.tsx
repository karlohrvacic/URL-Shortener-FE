"use client"

import { useEffect, useState, useRef } from "react"

interface CountUpProps {
  value: number
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 800, className }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    const start = prevValue.current
    const diff = value - start
    if (diff === 0) return

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(start + diff * eased))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    prevValue.current = value
    requestAnimationFrame(tick)
  }, [value, duration])

  return <span className={className}>{display.toLocaleString()}</span>
}
