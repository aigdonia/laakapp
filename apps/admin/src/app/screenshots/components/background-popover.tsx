"use client"

import { useRef } from "react"
import { useComposer } from "../lib/store"
import type { BackgroundType, GradientDirection } from "../lib/types"

interface Props {
  onClose: () => void
}

export function BackgroundPopover({ onClose }: Props) {
  const { activeScreen, dispatch } = useComposer()
  const ref = useRef<HTMLDivElement>(null)

  if (!activeScreen) return null

  const bg = activeScreen.background

  const updateBg = (changes: Record<string, any>) => {
    dispatch({ type: "SET_BACKGROUND", bg: changes })
  }

  const updateGradient = (changes: Record<string, any>) => {
    dispatch({
      type: "SET_BACKGROUND",
      bg: { gradient: { ...bg.gradient, ...changes } },
    })
  }

  const updateStop = (index: number, color: string) => {
    const stops = [...bg.gradient.stops]
    stops[index] = { ...stops[index], color }
    updateGradient({ stops })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateBg({ type: "image", imageDataUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1 z-50 bg-popover border rounded-lg shadow-xl p-4 min-w-[280px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Background</span>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* Type selector */}
      <div className="flex gap-1 mb-3">
        {(["solid", "gradient", "image"] as BackgroundType[]).map((type) => (
          <button
            key={type}
            className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
              bg.type === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent"
            }`}
            onClick={() => updateBg({ type })}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {bg.type === "solid" && (
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bg.color}
              onChange={(e) => updateBg({ color: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={bg.color}
              onChange={(e) => updateBg({ color: e.target.value })}
              className="flex-1 bg-muted border rounded px-2 py-1 text-xs font-mono"
            />
          </div>
        </div>
      )}

      {bg.type === "gradient" && (
        <div className="space-y-3">
          {/* Direction */}
          <div className="flex gap-1">
            {(["linear", "radial"] as GradientDirection[]).map((dir) => (
              <button
                key={dir}
                className={`flex-1 px-2 py-1 text-xs rounded-md transition-colors ${
                  bg.gradient.direction === dir
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted hover:bg-accent/50"
                }`}
                onClick={() => updateGradient({ direction: dir })}
              >
                {dir.charAt(0).toUpperCase() + dir.slice(1)}
              </button>
            ))}
          </div>

          {/* Angle (linear only) */}
          {bg.gradient.direction === "linear" && (
            <div>
              <label className="text-xs text-muted-foreground">
                Angle: {bg.gradient.angle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={bg.gradient.angle}
                onChange={(e) =>
                  updateGradient({ angle: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          )}

          {/* Color stops */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Colors</label>
            {bg.gradient.stops.map((stop, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(i, e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateStop(i, e.target.value)}
                  className="flex-1 bg-muted border rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {bg.type === "image" && (
        <div>
          <label className="block text-xs text-muted-foreground mb-2">
            Upload background image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-xs"
          />
        </div>
      )}
    </div>
  )
}
