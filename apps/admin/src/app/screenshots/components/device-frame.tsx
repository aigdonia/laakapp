"use client"

import { Group, Rect, Circle, Image as KonvaImage } from "react-konva"
import Konva from "konva"
import { useEffect, useState } from "react"
import type { DeviceElement } from "../lib/types"
import { deviceFrames } from "../lib/device-frames"

interface Props {
  element: DeviceElement
  isSelected: boolean
  onSelect: () => void
  onChange: (changes: Partial<DeviceElement>) => void
  onDragMove: (node: Konva.Node) => void
  onDragEnd: () => void
}

export function DeviceFrameNode({
  element,
  isSelected,
  onSelect,
  onChange,
  onDragMove,
  onDragEnd,
}: Props) {
  const [screenshot, setScreenshot] = useState<HTMLImageElement | null>(null)
  const spec = deviceFrames[element.deviceModel]

  useEffect(() => {
    if (!element.screenshotDataUrl) {
      setScreenshot(null)
      return
    }
    const img = new window.Image()
    img.onload = () => setScreenshot(img)
    img.src = element.screenshotDataUrl
  }, [element.screenshotDataUrl])

  const scaleX = element.width / spec.bezelWidth
  const scaleY = element.height / spec.bezelHeight

  const screenX = spec.screenInset
  const screenY = spec.screenInset
  const screenW = spec.bezelWidth - spec.screenInset * 2
  const screenH = spec.bezelHeight - spec.screenInset * 2

  return (
    <Group
      id={element.id}
      x={element.x}
      y={element.y}
      scaleX={scaleX}
      scaleY={scaleY}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={(e) => onDragMove(e.target)}
      onDragEnd={(e) => {
        onDragEnd()
        onChange({ x: e.target.x(), y: e.target.y() })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const newScaleX = node.scaleX()
        // Use uniform scale to maintain aspect ratio
        const uniformScale = newScaleX
        node.scaleX(scaleX)
        node.scaleY(scaleY)
        const newWidth = Math.max(50, spec.bezelWidth * uniformScale)
        const newHeight = newWidth * (spec.bezelHeight / spec.bezelWidth)
        onChange({
          x: node.x(),
          y: node.y(),
          width: newWidth,
          height: newHeight,
          rotation: node.rotation(),
        })
      }}
    >
      {/* Bezel */}
      <Rect
        width={spec.bezelWidth}
        height={spec.bezelHeight}
        cornerRadius={spec.bezelRadius}
        fill={spec.bezelColor}
        stroke={spec.bezelBorderColor}
        strokeWidth={spec.bezelBorderWidth}
        shadowEnabled={element.shadow}
        shadowColor="#000000"
        shadowBlur={80}
        shadowOffsetX={0}
        shadowOffsetY={24}
        shadowOpacity={0.7}
      />

      {/* Screen area */}
      <Group
        clipFunc={(ctx: any) => {
          ctx.beginPath()
          ctx.roundRect(screenX, screenY, screenW, screenH, spec.screenRadius)
          ctx.closePath()
        }}
      >
        {/* Screen background */}
        <Rect
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          fill="#000000"
        />

        {/* Screenshot image */}
        {screenshot && (
          <KonvaImage
            x={screenX}
            y={screenY}
            width={screenW}
            height={screenH}
            image={screenshot}
          />
        )}
      </Group>

      {/* Dynamic Island / Punch Hole */}
      {spec.notch.type === "dynamic-island" && (
        <Rect
          x={(spec.bezelWidth - spec.notch.width) / 2}
          y={spec.screenInset + spec.notch.y}
          width={spec.notch.width}
          height={spec.notch.height}
          cornerRadius={spec.notch.height / 2}
          fill="#000000"
        />
      )}
      {spec.notch.type === "punch-hole" && (
        <Circle
          x={spec.bezelWidth / 2}
          y={spec.screenInset + spec.notch.y}
          radius={spec.notch.radius}
          fill="#000000"
        />
      )}
    </Group>
  )
}
