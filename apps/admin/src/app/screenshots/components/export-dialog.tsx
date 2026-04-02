"use client"

import { useState } from "react"
import Konva from "konva"
import { IconDownload, IconX } from "@tabler/icons-react"
import { EXPORT_SIZES } from "../lib/constants"
import { exportScreenshot } from "../lib/export"
import { useComposer } from "../lib/store"

interface Props {
  onClose: () => void
}

export function ExportDialog({ onClose }: Props) {
  const { activeScreen } = useComposer()
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = async (
    width: number,
    height: number,
    label: string
  ) => {
    const stage = (window as any).__screenshotStage as Konva.Stage | undefined
    if (!stage || !activeScreen) return

    setExporting(label)
    try {
      await exportScreenshot(
        stage,
        width,
        height,
        activeScreen.name.replace(/\s+/g, "-").toLowerCase()
      )
    } catch (err) {
      console.error("Export failed:", err)
    }
    setExporting(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-popover border rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Export Screenshot</h3>
          <button
            className="p-1 rounded hover:bg-accent transition-colors"
            onClick={onClose}
          >
            <IconX size={18} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Choose export size for &ldquo;{activeScreen?.name}&rdquo;
        </p>

        <div className="space-y-2">
          {EXPORT_SIZES.map((size) => (
            <button
              key={size.label}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border hover:bg-accent transition-colors text-sm disabled:opacity-40"
              onClick={() => handleExport(size.width, size.height, size.label)}
              disabled={exporting !== null}
            >
              <span className="font-medium">{size.label}</span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="font-mono text-xs">
                  {size.width}×{size.height}
                </span>
                {exporting === size.label ? (
                  <span className="text-xs">Exporting...</span>
                ) : (
                  <IconDownload size={14} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
