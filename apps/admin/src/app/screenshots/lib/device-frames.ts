import type { DeviceModel } from "./types"

export interface DeviceFrameSpec {
  id: DeviceModel
  label: string
  // Outer bezel dimensions
  bezelWidth: number
  bezelHeight: number
  bezelRadius: number
  bezelColor: string
  bezelBorderWidth: number
  bezelBorderColor: string
  // Screen inset from bezel edges
  screenInset: number
  screenRadius: number
  // Notch/island/camera
  notch:
    | { type: "dynamic-island"; width: number; height: number; y: number }
    | { type: "punch-hole"; radius: number; y: number }
  // Default placement size on canvas (user can resize)
  defaultWidth: number
  defaultHeight: number
}

export const deviceFrames: Record<DeviceModel, DeviceFrameSpec> = {
  "iphone-15-pro": {
    id: "iphone-15-pro",
    label: "iPhone 15 Pro",
    bezelWidth: 430,
    bezelHeight: 932,
    bezelRadius: 55,
    bezelColor: "#1C1C1E",
    bezelBorderWidth: 2,
    bezelBorderColor: "#3A3A3C",
    screenInset: 5,
    screenRadius: 50,
    notch: { type: "dynamic-island", width: 126, height: 37, y: 12 },
    defaultWidth: 430,
    defaultHeight: 932,
  },
  "pixel-8": {
    id: "pixel-8",
    label: "Pixel 8",
    bezelWidth: 412,
    bezelHeight: 915,
    bezelRadius: 48,
    bezelColor: "#202124",
    bezelBorderWidth: 2,
    bezelBorderColor: "#5F6368",
    screenInset: 5,
    screenRadius: 43,
    notch: { type: "punch-hole", radius: 12, y: 16 },
    defaultWidth: 412,
    defaultHeight: 915,
  },
}
