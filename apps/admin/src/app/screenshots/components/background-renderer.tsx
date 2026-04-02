"use client"

import { Rect, Image as KonvaImage } from "react-konva"
import { useEffect, useState } from "react"
import type { ScreenBackground } from "../lib/types"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../lib/constants"

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

function createGradientCanvas(bg: ScreenBackground["gradient"]): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext("2d")!

  let gradient: CanvasGradient

  if (bg.direction === "radial") {
    const cx = CANVAS_WIDTH / 2
    const cy = CANVAS_HEIGHT / 2
    const radius = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) / 2
    gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  } else {
    const angleRad = (bg.angle * Math.PI) / 180
    const cx = CANVAS_WIDTH / 2
    const cy = CANVAS_HEIGHT / 2
    const len = Math.max(CANVAS_WIDTH, CANVAS_HEIGHT)
    const dx = Math.cos(angleRad) * len
    const dy = Math.sin(angleRad) * len
    gradient = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
  }

  for (const stop of bg.stops) {
    gradient.addColorStop(stop.offset, stop.color)
  }

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  return canvas
}

export function BackgroundRenderer({
  background,
}: {
  background: ScreenBackground
}) {
  const [gradientImage, setGradientImage] = useState<HTMLCanvasElement | null>(
    null
  )
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (background.type === "gradient") {
      setGradientImage(createGradientCanvas(background.gradient))
    }
  }, [background.type, background.gradient])

  useEffect(() => {
    if (background.type === "image" && background.imageDataUrl) {
      const img = new window.Image()
      img.onload = () => setBgImage(img)
      img.src = background.imageDataUrl
    }
  }, [background.type, background.imageDataUrl])

  if (background.type === "solid") {
    return (
      <Rect
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill={background.color}
        listening={false}
      />
    )
  }

  if (background.type === "gradient" && gradientImage) {
    return (
      <KonvaImage
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        image={gradientImage}
        listening={false}
      />
    )
  }

  if (background.type === "image" && bgImage) {
    return (
      <KonvaImage
        x={0}
        y={0}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        image={bgImage}
        listening={false}
      />
    )
  }

  // Fallback
  return (
    <Rect
      x={0}
      y={0}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={background.color}
      listening={false}
    />
  )
}
