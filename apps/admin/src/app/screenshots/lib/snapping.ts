import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants"

export interface Guide {
  position: number
  orientation: "vertical" | "horizontal"
}

const SNAP_THRESHOLD = 8

// Page guides: edges, center, thirds
function getPageGuides(): Guide[] {
  return [
    // Vertical guides (x positions)
    { position: 0, orientation: "vertical" },
    { position: CANVAS_WIDTH / 3, orientation: "vertical" },
    { position: CANVAS_WIDTH / 2, orientation: "vertical" },
    { position: (CANVAS_WIDTH * 2) / 3, orientation: "vertical" },
    { position: CANVAS_WIDTH, orientation: "vertical" },
    // Horizontal guides (y positions)
    { position: 0, orientation: "horizontal" },
    { position: CANVAS_HEIGHT / 3, orientation: "horizontal" },
    { position: CANVAS_HEIGHT / 2, orientation: "horizontal" },
    { position: (CANVAS_HEIGHT * 2) / 3, orientation: "horizontal" },
    { position: CANVAS_HEIGHT, orientation: "horizontal" },
  ]
}

interface ElementEdges {
  left: number
  right: number
  centerX: number
  top: number
  bottom: number
  centerY: number
}

function getElementEdges(
  x: number,
  y: number,
  width: number,
  height: number
): ElementEdges {
  return {
    left: x,
    right: x + width,
    centerX: x + width / 2,
    top: y,
    bottom: y + height,
    centerY: y + height / 2,
  }
}

export interface SnapResult {
  x: number
  y: number
  activeGuides: Guide[]
}

export function calculateSnap(
  x: number,
  y: number,
  width: number,
  height: number
): SnapResult {
  const guides = getPageGuides()
  const edges = getElementEdges(x, y, width, height)
  const activeGuides: Guide[] = []

  let snappedX = x
  let snappedY = y

  // Check vertical guides (snap x)
  let bestDx = SNAP_THRESHOLD + 1
  for (const guide of guides.filter((g) => g.orientation === "vertical")) {
    for (const edgeX of [edges.left, edges.centerX, edges.right]) {
      const dist = Math.abs(edgeX - guide.position)
      if (dist < bestDx) {
        bestDx = dist
        // Adjust x so this edge aligns with the guide
        snappedX = x + (guide.position - edgeX)
      }
    }
  }

  if (bestDx <= SNAP_THRESHOLD) {
    // Find which guides are active after snapping
    const snappedEdges = getElementEdges(snappedX, y, width, height)
    for (const guide of guides.filter((g) => g.orientation === "vertical")) {
      for (const edgeX of [snappedEdges.left, snappedEdges.centerX, snappedEdges.right]) {
        if (Math.abs(edgeX - guide.position) < 1) {
          activeGuides.push(guide)
        }
      }
    }
  } else {
    snappedX = x
  }

  // Check horizontal guides (snap y)
  let bestDy = SNAP_THRESHOLD + 1
  for (const guide of guides.filter((g) => g.orientation === "horizontal")) {
    for (const edgeY of [edges.top, edges.centerY, edges.bottom]) {
      const dist = Math.abs(edgeY - guide.position)
      if (dist < bestDy) {
        bestDy = dist
        snappedY = y + (guide.position - edgeY)
      }
    }
  }

  if (bestDy <= SNAP_THRESHOLD) {
    const snappedEdges = getElementEdges(snappedX, snappedY, width, height)
    for (const guide of guides.filter((g) => g.orientation === "horizontal")) {
      for (const edgeY of [snappedEdges.top, snappedEdges.centerY, snappedEdges.bottom]) {
        if (Math.abs(edgeY - guide.position) < 1) {
          activeGuides.push(guide)
        }
      }
    }
  } else {
    snappedY = y
  }

  return { x: snappedX, y: snappedY, activeGuides }
}
