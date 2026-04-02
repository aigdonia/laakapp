"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  type Dispatch,
} from "react"
import type {
  ComposerState,
  Screen,
  ScreenElement,
  ScreenBackground,
} from "./types"
import { DEFAULT_BACKGROUND } from "./constants"
import { loadState, saveState } from "./storage"

// ---------- Actions ----------

export type Action =
  | { type: "LOAD_STATE"; state: ComposerState }
  | { type: "SET_ACTIVE_SCREEN"; id: string }
  | { type: "ADD_SCREEN" }
  | { type: "DUPLICATE_SCREEN"; id: string }
  | { type: "DELETE_SCREEN"; id: string }
  | { type: "RENAME_SCREEN"; id: string; name: string }
  | { type: "SELECT_ELEMENT"; id: string | null }
  | { type: "ADD_ELEMENT"; element: ScreenElement }
  | { type: "UPDATE_ELEMENT"; id: string; changes: Partial<ScreenElement> }
  | { type: "DUPLICATE_ELEMENT"; id: string }
  | { type: "DELETE_ELEMENT"; id: string }
  | { type: "REORDER_ELEMENTS"; ids: string[] }
  | { type: "SET_BACKGROUND"; bg: Partial<ScreenBackground> }

// ---------- Helpers ----------

function getActiveScreen(state: ComposerState): Screen | undefined {
  return state.screens.find((s) => s.id === state.activeScreenId)
}

function updateActiveScreen(
  state: ComposerState,
  updater: (screen: Screen) => Screen
): ComposerState {
  return {
    ...state,
    screens: state.screens.map((s) =>
      s.id === state.activeScreenId ? updater(s) : s
    ),
  }
}

// ---------- Reducer ----------

function reducer(state: ComposerState, action: Action): ComposerState {
  switch (action.type) {
    case "LOAD_STATE":
      return action.state

    case "SET_ACTIVE_SCREEN":
      return { ...state, activeScreenId: action.id, selectedElementId: null }

    case "ADD_SCREEN": {
      const newScreen: Screen = {
        id: crypto.randomUUID(),
        name: `Screen ${state.screens.length + 1}`,
        elements: [],
        background: { ...DEFAULT_BACKGROUND },
        createdAt: Date.now(),
      }
      return {
        ...state,
        screens: [...state.screens, newScreen],
        activeScreenId: newScreen.id,
        selectedElementId: null,
      }
    }

    case "DUPLICATE_SCREEN": {
      const source = state.screens.find((s) => s.id === action.id)
      if (!source) return state
      const dup: Screen = {
        ...structuredClone(source),
        id: crypto.randomUUID(),
        name: `${source.name} (copy)`,
        createdAt: Date.now(),
      }
      return {
        ...state,
        screens: [...state.screens, dup],
        activeScreenId: dup.id,
        selectedElementId: null,
      }
    }

    case "DELETE_SCREEN": {
      const remaining = state.screens.filter((s) => s.id !== action.id)
      if (remaining.length === 0) return state
      const newActive =
        state.activeScreenId === action.id
          ? remaining[0].id
          : state.activeScreenId
      return {
        ...state,
        screens: remaining,
        activeScreenId: newActive,
        selectedElementId: null,
      }
    }

    case "RENAME_SCREEN":
      return {
        ...state,
        screens: state.screens.map((s) =>
          s.id === action.id ? { ...s, name: action.name } : s
        ),
      }

    case "SELECT_ELEMENT":
      return { ...state, selectedElementId: action.id }

    case "ADD_ELEMENT":
      return updateActiveScreen(state, (s) => ({
        ...s,
        elements: [...s.elements, action.element],
      }))

    case "UPDATE_ELEMENT":
      return updateActiveScreen(state, (s) => ({
        ...s,
        elements: s.elements.map((el) =>
          el.id === action.id
            ? ({ ...el, ...action.changes } as ScreenElement)
            : el
        ),
      }))

    case "DUPLICATE_ELEMENT": {
      const screen = getActiveScreen(state)
      const source = screen?.elements.find((el) => el.id === action.id)
      if (!source) return state
      const dup = {
        ...structuredClone(source),
        id: crypto.randomUUID(),
        name: `${source.name} (copy)`,
        x: source.x + 30,
        y: source.y + 30,
      } as ScreenElement
      return {
        ...updateActiveScreen(state, (s) => ({
          ...s,
          elements: [...s.elements, dup],
        })),
        selectedElementId: dup.id,
      }
    }

    case "DELETE_ELEMENT":
      return {
        ...updateActiveScreen(state, (s) => ({
          ...s,
          elements: s.elements.filter((el) => el.id !== action.id),
        })),
        selectedElementId:
          state.selectedElementId === action.id
            ? null
            : state.selectedElementId,
      }

    case "REORDER_ELEMENTS":
      return updateActiveScreen(state, (s) => {
        const byId = new Map(s.elements.map((el) => [el.id, el]))
        return {
          ...s,
          elements: action.ids
            .map((id) => byId.get(id))
            .filter(Boolean) as ScreenElement[],
        }
      })

    case "SET_BACKGROUND":
      return updateActiveScreen(state, (s) => ({
        ...s,
        background: { ...s.background, ...action.bg },
      }))

    default:
      return state
  }
}

// ---------- Context ----------

interface ComposerContextValue {
  state: ComposerState
  dispatch: Dispatch<Action>
  activeScreen: Screen | undefined
  selectedElement: ScreenElement | undefined
}

const ComposerContext = createContext<ComposerContextValue | null>(null)

export function useComposer(): ComposerContextValue {
  const ctx = useContext(ComposerContext)
  if (!ctx) throw new Error("useComposer must be used within ComposerProvider")
  return ctx
}

// ---------- Provider ----------

export function ComposerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save debounced
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveState(state), 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state])

  const activeScreen = getActiveScreen(state)
  const selectedElement = activeScreen?.elements.find(
    (el) => el.id === state.selectedElementId
  )

  const value = useCallback(
    () => ({ state, dispatch, activeScreen, selectedElement }),
    [state, activeScreen, selectedElement]
  )

  return (
    <ComposerContext.Provider value={value()}>
      {children}
    </ComposerContext.Provider>
  )
}
