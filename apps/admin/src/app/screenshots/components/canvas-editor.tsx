"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Stage, Layer, Line, Transformer } from "react-konva"
import Konva from "konva"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../lib/constants"
import { useComposer } from "../lib/store"
import { BackgroundRenderer } from "./background-renderer"
import { CanvasElement } from "./canvas-element"
import { calculateSnap, type Guide } from "../lib/snapping"

export function CanvasEditor() {
  const { state, dispatch, activeScreen, selectedElement } = useComposer()
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [scale, setScale] = useState(0.2)
  const [activeGuides, setActiveGuides] = useState<Guide[]>([])

  // Fit canvas to container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect()
      const padding = 40
      const scaleX = (width - padding) / CANVAS_WIDTH
      const scaleY = (height - padding) / CANVAS_HEIGHT
      setScale(Math.min(scaleX, scaleY))
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Attach transformer to selected element
  useEffect(() => {
    const transformer = transformerRef.current
    const stage = stageRef.current
    if (!transformer || !stage) return

    if (state.selectedElementId) {
      const node = stage.findOne(`#${state.selectedElementId}`)
      if (node) {
        transformer.nodes([node])
        transformer.getLayer()?.batchDraw()
        return
      }
    }

    transformer.nodes([])
    transformer.getLayer()?.batchDraw()
  }, [state.selectedElementId, activeScreen?.elements])

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (e.target === e.target.getStage()) {
        dispatch({ type: "SELECT_ELEMENT", id: null })
      }
    },
    [dispatch]
  )

  const handleDragMove = useCallback(
    (elementId: string, node: Konva.Node) => {
      const el = activeScreen?.elements.find((e) => e.id === elementId)
      if (!el) return

      const result = calculateSnap(
        node.x(),
        node.y(),
        el.width,
        el.height
      )

      node.x(result.x)
      node.y(result.y)
      setActiveGuides(result.activeGuides)
    },
    [activeScreen?.elements]
  )

  const handleDragEnd = useCallback(() => {
    setActiveGuides([])
  }, [])

  // Expose stage ref for export
  useEffect(() => {
    if (stageRef.current) {
      ;(window as any).__screenshotStage = stageRef.current
    }
  }, [])

  if (!activeScreen) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        No screen selected
      </div>
    )
  }

  const stageWidth = CANVAS_WIDTH * scale
  const stageHeight = CANVAS_HEIGHT * scale

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 flex items-center justify-center bg-muted/20 overflow-hidden relative z-0"
    >
      <div
        style={{
          width: stageWidth,
          height: stageHeight,
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          scaleX={scale}
          scaleY={scale}
          style={{
            width: stageWidth,
            height: stageHeight,
          }}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            <BackgroundRenderer background={activeScreen.background} />
            {activeScreen.elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                isSelected={state.selectedElementId === element.id}
                onSelect={() =>
                  dispatch({ type: "SELECT_ELEMENT", id: element.id })
                }
                onChange={(changes) =>
                  dispatch({
                    type: "UPDATE_ELEMENT",
                    id: element.id,
                    changes,
                  })
                }
                onDragMove={(node) => handleDragMove(element.id, node)}
                onDragEnd={handleDragEnd}
              />
            ))}

            {/* Snap guide lines */}
            {activeGuides.map((guide, i) =>
              guide.orientation === "vertical" ? (
                <Line
                  key={`guide-${i}`}
                  points={[guide.position, 0, guide.position, CANVAS_HEIGHT]}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dash={[8, 6]}
                  listening={false}
                />
              ) : (
                <Line
                  key={`guide-${i}`}
                  points={[0, guide.position, CANVAS_WIDTH, guide.position]}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dash={[8, 6]}
                  listening={false}
                />
              )
            )}

            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              keepRatio={selectedElement?.type === "device"}
              enabledAnchors={
                selectedElement?.type === "device"
                  ? ["top-left", "top-right", "bottom-left", "bottom-right"]
                  : [
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                      "middle-left",
                      "middle-right",
                      "top-center",
                      "bottom-center",
                    ]
              }
              boundBoxFunc={(oldBox, newBox) => {
                if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 20) {
                  return oldBox
                }
                return newBox
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
