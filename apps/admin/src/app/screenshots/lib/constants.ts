export const CANVAS_WIDTH = 1290
export const CANVAS_HEIGHT = 2796

export const EXPORT_SIZES = [
  { label: "iOS 6.5\" (Default)", width: 1242, height: 2688 },
  { label: "iOS 6.5\" Landscape", width: 2688, height: 1242 },
  { label: "iOS 6.5\" Alt", width: 1284, height: 2778 },
  { label: "iOS 6.5\" Alt Landscape", width: 2778, height: 1284 },
  { label: "iOS 6.7\"", width: 1290, height: 2796 },
  { label: "iOS 6.7\" Landscape", width: 2796, height: 1290 },
  { label: "Android", width: 1080, height: 1920 },
] as const

export const FONTS = [
  { label: "Geist Sans", value: "Geist" },
  { label: "Geist Mono", value: "Geist Mono" },
  { label: "Lora", value: "Lora" },
  { label: "Nunito Sans", value: "Nunito Sans" },
] as const

export const DEFAULT_BACKGROUND = {
  type: "solid" as const,
  color: "#FFF8D6",
  gradient: {
    direction: "linear" as const,
    angle: 180,
    stops: [
      { offset: 0, color: "#667eea" },
      { offset: 1, color: "#764ba2" },
    ],
  },
  imageDataUrl: null,
}
