"use client"

import { useEffect, useState } from "react"

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function EasterEggKonami() {
  const [activated, setActivated] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let seq: string[] = []

    const handler = (e: KeyboardEvent) => {
      seq.push(e.key)
      if (seq.length > KONAMI.length) seq = seq.slice(-KONAMI.length)

      if (seq.length === KONAMI.length && seq.every((k, i) => k === KONAMI[i])) {
        setActivated(true)
        setTimeout(() => setVisible(true), 100)
        setTimeout(() => setVisible(false), 5000)
        seq = []
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  if (!activated) return null

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        background: "linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b)",
        backgroundSize: "400% 400%",
        animation: "rainbow-shift 3s ease infinite",
        mixBlendMode: "overlay",
      }}
    />
  )
}
