"use client"

import { useRef, useState } from "react"
import {
  IconDeviceMobile,
  IconTypography,
  IconPhoto,
  IconPalette,
  IconTrash,
  IconDownload,
} from "@tabler/icons-react"
import { useComposer } from "../lib/store"
import { deviceFrames } from "../lib/device-frames"
import { CANVAS_WIDTH, CANVAS_HEIGHT, FONTS } from "../lib/constants"
import { resizeImage } from "../lib/export"
import type { DeviceElement, TextElement, ImageElement, DeviceModel } from "../lib/types"
import { ExportDialog } from "./export-dialog"
import { BackgroundPopover } from "./background-popover"

export function Toolbar() {
  const { state, dispatch, activeScreen } = useComposer()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [showExport, setShowExport] = useState(false)
  const [showBg, setShowBg] = useState(false)
  const [showDeviceMenu, setShowDeviceMenu] = useState(false)

  const deviceCount =
    activeScreen?.elements.filter((e) => e.type === "device").length ?? 0

  const addDevice = async (model: DeviceModel) => {
    if (deviceCount >= 2) return
    setShowDeviceMenu(false)

    const spec = deviceFrames[model]
    const element: DeviceElement = {
      id: crypto.randomUUID(),
      type: "device",
      name: spec.label,
      x: (CANVAS_WIDTH - spec.defaultWidth) / 2,
      y: (CANVAS_HEIGHT - spec.defaultHeight) / 2,
      width: spec.defaultWidth,
      height: spec.defaultHeight,
      rotation: 0,
      opacity: 1,
      visible: true,
      deviceModel: model,
      screenshotDataUrl: null,
      shadow: false,
    }

    dispatch({ type: "ADD_ELEMENT", element })
    dispatch({ type: "SELECT_ELEMENT", id: element.id })
  }

  const addText = () => {
    const element: TextElement = {
      id: crypto.randomUUID(),
      type: "text",
      name: "Text",
      x: CANVAS_WIDTH / 2 - 300,
      y: 200,
      width: 600,
      height: 120,
      rotation: 0,
      opacity: 1,
      visible: true,
      content: "Your text here",
      fontSize: 72,
      fontFamily: FONTS[0].value,
      fontWeight: 700,
      fill: "#FFFFFF",
      textAlign: "center",
    }

    dispatch({ type: "ADD_ELEMENT", element })
    dispatch({ type: "SELECT_ELEMENT", id: element.id })
  }

  const addImage = () => {
    imageInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = await resizeImage(
        reader.result as string,
        2048,
        2048,
        0.9
      )

      const img = new window.Image()
      img.onload = () => {
        const maxW = CANVAS_WIDTH * 0.5
        const ratio = Math.min(maxW / img.width, maxW / img.height)
        const w = img.width * ratio
        const h = img.height * ratio

        const element: ImageElement = {
          id: crypto.randomUUID(),
          type: "image",
          name: file.name.replace(/\.[^.]+$/, ""),
          x: (CANVAS_WIDTH - w) / 2,
          y: (CANVAS_HEIGHT - h) / 2,
          width: w,
          height: h,
          rotation: 0,
          opacity: 1,
          visible: true,
          imageDataUrl: dataUrl,
        }

        dispatch({ type: "ADD_ELEMENT", element })
        dispatch({ type: "SELECT_ELEMENT", id: element.id })
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const deleteSelected = () => {
    if (state.selectedElementId) {
      dispatch({ type: "DELETE_ELEMENT", id: state.selectedElementId })
    }
  }

  const btnClass =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:pointer-events-none"

  return (
    <>
      <div className="flex items-center gap-1 px-3 py-2 border-b bg-background/80 backdrop-blur-sm relative z-10 shrink-0">
        {/* Device dropdown */}
        <div className="relative">
          <button
            className={btnClass}
            onClick={() => setShowDeviceMenu(!showDeviceMenu)}
            disabled={deviceCount >= 2}
          >
            <IconDeviceMobile size={16} />
            Device
          </button>
          {showDeviceMenu && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-popover border rounded-md shadow-lg py-1 min-w-[160px]">
              {Object.values(deviceFrames).map((spec) => (
                <button
                  key={spec.id}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  onClick={() => addDevice(spec.id)}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className={btnClass} onClick={addText}>
          <IconTypography size={16} />
          Text
        </button>

        <button className={btnClass} onClick={addImage}>
          <IconPhoto size={16} />
          Image
        </button>

        <div className="relative">
          <button
            className={btnClass}
            onClick={() => setShowBg(!showBg)}
          >
            <IconPalette size={16} />
            Background
          </button>
          {showBg && (
            <BackgroundPopover onClose={() => setShowBg(false)} />
          )}
        </div>

        <div className="flex-1" />

        <button
          className={btnClass}
          onClick={deleteSelected}
          disabled={!state.selectedElementId}
        >
          <IconTrash size={16} />
        </button>

        <button
          className={`${btnClass} bg-primary text-primary-foreground hover:bg-primary/90`}
          onClick={() => setShowExport(true)}
        >
          <IconDownload size={16} />
          Export
        </button>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </>
  )
}
