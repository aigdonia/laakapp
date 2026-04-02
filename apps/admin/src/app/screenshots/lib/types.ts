export type ElementType = "device" | "text" | "image"
export type BackgroundType = "solid" | "gradient" | "image"
export type DeviceModel = "iphone-15-pro" | "pixel-8"
export type GradientDirection = "linear" | "radial"

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  visible: boolean
  name: string
}

export interface DeviceElement extends BaseElement {
  type: "device"
  deviceModel: DeviceModel
  screenshotDataUrl: string | null
  shadow: boolean
}

export interface TextElement extends BaseElement {
  type: "text"
  content: string
  fontSize: number
  fontFamily: string
  fontWeight: number
  fill: string
  textAlign: "left" | "center" | "right"
}

export interface ImageElement extends BaseElement {
  type: "image"
  imageDataUrl: string
}

export type ScreenElement = DeviceElement | TextElement | ImageElement

export interface GradientStop {
  offset: number
  color: string
}

export interface ScreenBackground {
  type: BackgroundType
  color: string
  gradient: {
    direction: GradientDirection
    angle: number
    stops: GradientStop[]
  }
  imageDataUrl: string | null
}

export interface Screen {
  id: string
  name: string
  elements: ScreenElement[]
  background: ScreenBackground
  createdAt: number
}

export interface ComposerState {
  version: 1
  screens: Screen[]
  activeScreenId: string | null
  selectedElementId: string | null
}
