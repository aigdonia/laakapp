"use client"

import { useState } from "react"
import type { Prompt } from "@fin-ai/shared"
import { PromptsList } from "./prompts-list"
import { PromptEditor } from "./prompt-editor"

export function PromptsPlayground({
  initialPrompts,
}: {
  initialPrompts: Prompt[]
}) {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [selectedId, setSelectedId] = useState<string | null>(
    prompts[0]?.id ?? null,
  )
  const [isCreating, setIsCreating] = useState(false)

  const selectedPrompt = isCreating
    ? null
    : prompts.find((p) => p.id === selectedId) ?? null

  function handleSelect(prompt: Prompt) {
    setIsCreating(false)
    setSelectedId(prompt.id)
  }

  function handleNew() {
    setIsCreating(true)
    setSelectedId(null)
  }

  function handleSaved(saved: Prompt) {
    setPrompts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [...prev, saved]
    })
    setSelectedId(saved.id)
    setIsCreating(false)
  }

  function handleDeleted(id: string) {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
    setSelectedId(prompts.find((p) => p.id !== id)?.id ?? null)
    setIsCreating(false)
  }

  return (
    <div className="flex flex-col gap-0 h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground text-sm">
            Configure AI prompt templates.
          </p>
        </div>
      </div>

      {/* Playground */}
      <div className="flex flex-1 min-h-0 border-t mx-4 lg:mx-6 rounded-lg border overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/30 shrink-0">
          <PromptsList
            prompts={prompts}
            selectedId={isCreating ? null : selectedId}
            onSelect={handleSelect}
            onNew={handleNew}
          />
        </div>

        {/* Editor */}
        <div className="flex-1 min-w-0">
          {isCreating ? (
            <PromptEditor
              prompt={null}
              onSaved={handleSaved}
            />
          ) : selectedPrompt ? (
            <PromptEditor
              key={selectedPrompt.id}
              prompt={selectedPrompt}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center h-full text-muted-foreground">
              Select a prompt to edit or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
