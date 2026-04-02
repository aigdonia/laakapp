import Konva from "konva"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants"

export async function exportScreenshot(
  stage: Konva.Stage,
  targetWidth: number,
  targetHeight: number,
  fileName: string
): Promise<void> {
  // Hide transformer nodes before export
  const transformers = stage.find("Transformer")
  transformers.forEach((t) => t.visible(false))
  stage.batchDraw()

  const isLandscape = targetWidth > targetHeight

  // For landscape: render at portrait equivalent, then rotate
  const renderWidth = isLandscape ? targetHeight : targetWidth
  const renderHeight = isLandscape ? targetWidth : targetHeight

  const pixelRatio = renderWidth / CANVAS_WIDTH

  const dataUrl = stage.toDataURL({
    pixelRatio,
    mimeType: "image/png",
    quality: 1,
  })

  // Restore transformers
  transformers.forEach((t) => t.visible(true))
  stage.batchDraw()

  const img = new Image()
  img.src = dataUrl

  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })

  const offscreen = document.createElement("canvas")
  offscreen.width = targetWidth
  offscreen.height = targetHeight
  const ctx = offscreen.getContext("2d")!

  if (isLandscape) {
    // Rotate 90° CCW for landscape
    ctx.translate(0, targetHeight)
    ctx.rotate(-Math.PI / 2)
    // After rotation, draw dimensions are swapped
    const scaleX = targetHeight / img.width
    const scaleY = targetWidth / img.height
    const scale = Math.min(scaleX, scaleY)
    const offsetX = (targetHeight - img.width * scale) / 2
    const offsetY = (targetWidth - img.height * scale) / 2
    ctx.drawImage(
      img,
      offsetX,
      offsetY,
      img.width * scale,
      img.height * scale
    )
  } else {
    // Portrait: center-fit into target dimensions
    const scaleX = targetWidth / img.width
    const scaleY = targetHeight / img.height
    const scale = Math.min(scaleX, scaleY)
    const offsetX = (targetWidth - img.width * scale) / 2
    const offsetY = (targetHeight - img.height * scale) / 2
    ctx.drawImage(
      img,
      offsetX,
      offsetY,
      img.width * scale,
      img.height * scale
    )
  }

  offscreen.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}-${targetWidth}x${targetHeight}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, "image/png")
}

export function resizeImage(
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      // Use PNG for images with transparency, JPEG for others
      const isPng = dataUrl.startsWith("data:image/png")
      resolve(
        isPng
          ? canvas.toDataURL("image/png")
          : canvas.toDataURL("image/jpeg", quality)
      )
    }
    img.src = dataUrl
  })
}
