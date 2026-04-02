"use client"

import { Text } from "react-konva"
import Konva from "konva"
import type { TextElement as TextElementType } from "../lib/types"

interface Props {
  element: TextElementType
  isSelected: boolean
  onSelect: () => void
  onChange: (changes: Partial<TextElementType>) => void
  onDragMove: (node: Konva.Node) => void
  onDragEnd: () => void
}

export function TextElementNode({ element, isSelected, onSelect, onChange, onDragMove, onDragEnd }: Props) {
  return (
    <Text
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      text={element.content}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={element.fontWeight >= 700 ? "bold" : "normal"}
      fill={element.fill}
      align={element.textAlign}
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
