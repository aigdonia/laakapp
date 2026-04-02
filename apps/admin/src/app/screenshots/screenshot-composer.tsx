"use client"

import { ComposerProvider } from "./lib/store"
import { CanvasEditor } from "./components/canvas-editor"
import { Toolbar } from "./components/toolbar"
import { ScreensPanel } from "./components/screens-panel"
import { PropertiesPanel } from "./components/properties-panel"
import { LayersPanel } from "./components/layers-panel"

export function ScreenshotComposer() {
  return (
    <ComposerProvider>
      <div className="flex flex-col h-[calc(100vh-4rem)] -mt-4 md:-mt-6 overflow-hidden border rounded-lg">
        <div className="flex flex-1 min-h-0 min-w-0 w-full overflow-hidden">
          {/* Left: Screen list */}
          <ScreensPanel />

          {/* Center: Toolbar + Canvas */}
          <div className="flex flex-col min-w-0 overflow-hidden" style={{ width: "calc(100% - 30rem)" }}>
            <Toolbar />
            <CanvasEditor />
          </div>

          {/* Right: Properties + Layers */}
          <div className="w-64 border-l bg-muted/30 flex flex-col shrink-0">
            <PropertiesPanel />
            <LayersPanel />
          </div>
        </div>
      </div>
    </ComposerProvider>
  )
}
