"use client"

import { useRef, useState } from "react"
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

type Level = "L" | "M" | "Q" | "H"

interface QrCustomizerProps {
  value: string
  filename?: string
}

export function QrCustomizer({ value, filename = "qr-code" }: QrCustomizerProps) {
  const [fgColor, setFgColor] = useState("#a67c00")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [transparent, setTransparent] = useState(false)
  const [size, setSize] = useState(220)
  const [level, setLevel] = useState<Level>("M")

  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const svgWrapRef = useRef<HTMLDivElement>(null)

  const effectiveBg = transparent ? "transparent" : bgColor

  const downloadPng = () => {
    const canvas = canvasWrapRef.current?.querySelector("canvas")
    if (!canvas) return
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = `${filename}.png`
    a.click()
  }

  const downloadSvg = () => {
    const svg = svgWrapRef.current?.querySelector("svg")
    if (!svg) return
    const source = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([source], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={canvasWrapRef} className="rounded-lg p-3 max-w-full overflow-hidden" style={{ background: transparent ? "transparent" : "#ffffff" }}>
        <QRCodeCanvas value={value} size={size} fgColor={fgColor} bgColor={effectiveBg} level={level} marginSize={2} style={{ maxWidth: "100%", height: "auto" }} />
      </div>
      {/* hidden SVG mirror for vector export */}
      <div ref={svgWrapRef} className="hidden">
        <QRCodeSVG value={value} size={size} fgColor={fgColor} bgColor={effectiveBg} level={level} marginSize={2} />
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-7 w-9 rounded border border-border/50 bg-transparent cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Background</Label>
            <input type="color" value={bgColor} disabled={transparent} onChange={(e) => setBgColor(e.target.value)} className="h-7 w-9 rounded border border-border/50 bg-transparent cursor-pointer disabled:opacity-40" />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
            Transparent
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-xs text-muted-foreground w-12">Size</Label>
          <input type="range" min={120} max={512} step={20} value={size} onChange={(e) => setSize(Number(e.target.value))} className="flex-1 accent-primary" />
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{size}px</span>
        </div>

        <div className="flex items-center gap-3">
          <Label className="text-xs text-muted-foreground w-12">Quality</Label>
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs">
            <option value="L">Low (more data)</option>
            <option value="M">Medium</option>
            <option value="Q">Quartile</option>
            <option value="H">High (most robust)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <Button type="button" variant="outline" size="sm" className="flex-1 h-9 text-xs border-border/50" onClick={downloadPng}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> PNG
        </Button>
        <Button type="button" variant="outline" size="sm" className="flex-1 h-9 text-xs border-border/50" onClick={downloadSvg}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> SVG
        </Button>
      </div>
    </div>
  )
}
