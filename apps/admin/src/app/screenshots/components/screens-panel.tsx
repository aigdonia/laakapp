"use client"

import { useRef, useState } from "react"
import {
  IconPlus,
  IconCopy,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react"
import { useComposer } from "../lib/store"

export function ScreensPanel() {
  const { state, dispatch } = useComposer()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const startRename = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const confirmRename = () => {
    if (editingId && editName.trim()) {
      dispatch({ type: "RENAME_SCREEN", id: editingId, name: editName.trim() })
    }
    setEditingId(null)
  }

  return (
    <div className="w-56 border-r bg-muted/30 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Screens
        </span>
        <button
          className="p-1 rounded hover:bg-accent transition-colors"
          onClick={() => dispatch({ type: "ADD_SCREEN" })}
          title="New screen"
        >
          <IconPlus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {state.screens.map((screen) => {
          const isActive = screen.id === state.activeScreenId

          return (
            <div
              key={screen.id}
              className={`group rounded-md border transition-colors cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-border hover:bg-accent/50"
              }`}
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_SCREEN", id: screen.id })
              }
            >
              <div className="px-2 py-1.5 flex items-center gap-1.5">
                {editingId === screen.id ? (
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <input
                      ref={inputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmRename()
                        if (e.key === "Escape") setEditingId(null)
                      }}
                      onBlur={confirmRename}
                      className="flex-1 min-w-0 bg-background border rounded px-1 py-0.5 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <span
                    className="flex-1 text-xs truncate"
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      startRename(screen.id, screen.name)
                    }}
                  >
                    {screen.name}
                  </span>
                )}

                {/* Actions */}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    className="p-0.5 rounded hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({
                        type: "DUPLICATE_SCREEN",
                        id: screen.id,
                      })
                    }}
                    title="Duplicate"
                  >
                    <IconCopy size={12} />
                  </button>
                  {state.screens.length > 1 && (
                    <button
                      className="p-0.5 rounded hover:bg-destructive/20 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch({
                          type: "DELETE_SCREEN",
                          id: screen.id,
                        })
                      }}
                      title="Delete"
                    >
                      <IconTrash size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
