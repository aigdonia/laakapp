"use client"

import type { Prompt } from "@fin-ai/shared"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function PromptsList({
  prompts,
  selectedId,
  onSelect,
  onNew,
}: {
  prompts: Prompt[]
  selectedId: string | null
  onSelect: (prompt: Prompt) => void
  onNew: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prompts
        </span>
        <Button variant="ghost" size="icon-xs" onClick={onNew}>
          <IconPlus className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => onSelect(prompt)}
            className={`w-full text-start px-3 py-2.5 transition-colors ${
              selectedId === prompt.id
                ? "bg-accent/10 border-l-2 border-l-primary"
                : "hover:bg-muted/50 border-l-2 border-l-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="size-2 rounded-full shrink-0"
                style={{
                  backgroundColor: prompt.enabled ? "#34c759" : "#8e8e93",
                }}
              />
              <span className="text-sm font-medium truncate">{prompt.name}</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5 pl-4 truncate">
              {prompt.slug}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
