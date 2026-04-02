"use client"

import { Image as KonvaImage } from "react-konva"
import Konva from "konva"
import { useEffect, useState } from "react"
import type { ImageElement as ImageElementType } from "../lib/types"

interface Props {
  element: ImageElementType
  isSelected: boolean
  onSelect: () => void
  onChange: (changes: Partial<ImageElementType>) => void
  onDragMove: (node: Konva.Node) => void
  onDragEnd: () => void
}

export function ImageElementNode({
  element,
  isSelected,
  onSelect,
  onChange,
  onDragMove,
  onDragEnd,
}: Props) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setImage(img)
    img.src = element.imageDataUrl
  }, [element.imageDataUrl])

  if (!image) return null

  return (
    <KonvaImage
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      image={image}
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
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onChange({
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * scaleX),
          height: Math.max(20, node.height() * scaleY),
          rotation: node.rotation(),
        })
      }}
    />
  )
}
