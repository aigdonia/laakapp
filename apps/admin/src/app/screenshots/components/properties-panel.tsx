"use client"

import { useRef } from "react"
import { useComposer } from "../lib/store"
import { FONTS } from "../lib/constants"
import { deviceFrames } from "../lib/device-frames"
import { resizeImage } from "../lib/export"
import type {
  ScreenElement,
  TextElement,
  ImageElement,
  DeviceElement,
  DeviceModel,
} from "../lib/types"

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground w-16 shrink-0">
        {label}
      </label>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="flex-1 bg-muted border rounded px-2 py-1 text-xs font-mono"
      />
    </div>
  )
}

function TextProperties({ element }: { element: TextElement }) {
  const { dispatch } = useComposer()
  const update = (changes: Partial<TextElement>) =>
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes })

  return (
    <>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">
          Content
        </label>
        <textarea
          value={element.content}
          onChange={(e) => update({ content: e.target.value })}
          rows={3}
          className="w-full bg-muted border rounded px-2 py-1 text-xs resize-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-16 shrink-0">
          Font
        </label>
        <select
          value={element.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="flex-1 bg-muted border rounded px-2 py-1 text-xs"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <NumberInput
        label="Size"
        value={element.fontSize}
        onChange={(v) => update({ fontSize: v })}
        min={8}
        max={400}
      />

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-16 shrink-0">
          Weight
        </label>
        <select
          value={element.fontWeight}
          onChange={(e) => update({ fontWeight: parseInt(e.target.value) })}
          className="flex-1 bg-muted border rounded px-2 py-1 text-xs"
        >
          <option value={400}>Regular</option>
          <option value={700}>Bold</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-16 shrink-0">
          Color
        </label>
        <input
          type="color"
          value={element.fill}
          onChange={(e) => update({ fill: e.target.value })}
          className="w-8 h-6 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={element.fill}
          onChange={(e) => update({ fill: e.target.value })}
          className="flex-1 bg-muted border rounded px-2 py-1 text-xs font-mono"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-16 shrink-0">
          Align
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
                element.textAlign === a
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-accent"
              }`}
              onClick={() => update({ textAlign: a })}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function ImageProperties({ element }: { element: ImageElement }) {
  const { dispatch } = useComposer()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = await resizeImage(reader.result as string, 2048, 2048, 0.9)
      dispatch({
        type: "UPDATE_ELEMENT",
        id: element.id,
        changes: { imageDataUrl: dataUrl },
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <button
        className="w-full px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-accent transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        Replace image
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplace}
      />
    </>
  )
}

function DeviceProperties({ element }: { element: DeviceElement }) {
  const { dispatch } = useComposer()
  const inputRef = useRef<HTMLInputElement>(null)

  const update = (changes: Partial<DeviceElement>) =>
    dispatch({ type: "UPDATE_ELEMENT", id: element.id, changes })

  const handleScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = await resizeImage(
        reader.result as string,
        1290,
        2796,
        0.8
      )
      update({ screenshotDataUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-16 shrink-0">
          Device
        </label>
        <select
          value={element.deviceModel}
          onChange={(e) => update({ deviceModel: e.target.value as DeviceModel })}
          className="flex-1 bg-muted border rounded px-2 py-1 text-xs"
        >
          {Object.values(deviceFrames).map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground w-16 shrink-0">
          Shadow
        </label>
        <button
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            element.shadow
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-accent"
          }`}
          onClick={() => update({ shadow: !element.shadow })}
        >
          {element.shadow ? "On" : "Off"}
        </button>
      </div>

      <button
        className="w-full px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-accent transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {element.screenshotDataUrl ? "Replace screenshot" : "Upload screenshot"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleScreenshot}
      />
    </>
  )
}

export function PropertiesPanel() {
  const { state, dispatch, selectedElement } = useComposer()

  if (!selectedElement) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="px-3 py-2 border-b">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Properties
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground px-4 text-center">
          Select an element to edit properties
        </div>
      </div>
    )
  }

  const update = (changes: Partial<ScreenElement>) =>
    dispatch({ type: "UPDATE_ELEMENT", id: selectedElement.id, changes })

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-3 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Properties
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Name */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground w-16 shrink-0">
            Name
          </label>
          <input
            type="text"
            value={selectedElement.name}
            onChange={(e) => update({ name: e.target.value })}
            className="flex-1 bg-muted border rounded px-2 py-1 text-xs"
          />
        </div>

        {/* Position */}
        <NumberInput
          label="X"
          value={selectedElement.x}
          onChange={(v) => update({ x: v })}
        />
        <NumberInput
          label="Y"
          value={selectedElement.y}
          onChange={(v) => update({ y: v })}
        />
        <NumberInput
          label="Width"
          value={selectedElement.width}
          onChange={(v) => update({ width: v })}
          min={20}
        />
        <NumberInput
          label="Height"
          value={selectedElement.height}
          onChange={(v) => update({ height: v })}
          min={20}
        />
        <NumberInput
          label="Rotation"
          value={selectedElement.rotation}
          onChange={(v) => update({ rotation: v })}
          min={-360}
          max={360}
        />

        {/* Opacity */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground w-16 shrink-0">
            Opacity
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={selectedElement.opacity}
            onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-xs font-mono w-8 text-right">
            {Math.round(selectedElement.opacity * 100)}%
          </span>
        </div>

        <div className="border-t my-2" />

        {/* Type-specific */}
        {selectedElement.type === "text" && (
          <TextProperties element={selectedElement} />
        )}
        {selectedElement.type === "image" && (
          <ImageProperties element={selectedElement} />
        )}
        {selectedElement.type === "device" && (
          <DeviceProperties element={selectedElement} />
        )}
      </div>
    </div>
  )
}
