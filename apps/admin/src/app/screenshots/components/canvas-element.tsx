"use client"

import Konva from "konva"
import type { ScreenElement } from "../lib/types"
import { TextElementNode } from "./text-element"
import { ImageElementNode } from "./image-element"
import { DeviceFrameNode } from "./device-frame"

interface Props {
  element: ScreenElement
  isSelected: boolean
  onSelect: () => void
  onChange: (changes: Partial<ScreenElement>) => void
  onDragMove: (node: Konva.Node) => void
  onDragEnd: () => void
}

export function CanvasElement({ element, isSelected, onSelect, onChange, onDragMove, onDragEnd }: Props) {
  switch (element.type) {
    case "text":
      return (
        <TextElementNode
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
      )
    case "image":
      return (
        <ImageElementNode
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
      )
    case "device":
      return (
        <DeviceFrameNode
          element={element}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
      )
    default:
      return null
  }
}
