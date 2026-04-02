import type { ComposerState } from "./types"
import { DEFAULT_BACKGROUND } from "./constants"

const STORAGE_KEY = "laak-screenshot-composer"
const CURRENT_VERSION = 1

function createDefaultState(): ComposerState {
  const defaultScreenId = crypto.randomUUID()
  return {
    version: 1,
    screens: [
      {
        id: defaultScreenId,
        name: "Screen 1",
        elements: [],
        background: { ...DEFAULT_BACKGROUND },
        createdAt: Date.now(),
      },
    ],
    activeScreenId: defaultScreenId,
    selectedElementId: null,
  }
}

export function loadState(): ComposerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()

    const parsed = JSON.parse(raw) as ComposerState
    if (parsed.version !== CURRENT_VERSION) return createDefaultState()

    return parsed
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: ComposerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error("Failed to save screenshot composer state:", e)
  }
}
