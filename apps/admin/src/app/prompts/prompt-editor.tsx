"use client"

import { useState } from "react"
import type { Prompt } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createPrompt, updatePrompt, deletePrompt } from "./actions"
import { toast } from "sonner"

const KNOWN_MODELS = [
  { value: "gemini-3-flash", label: "Gemini 3 Flash" },
  { value: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function PromptEditor({
  prompt,
  onSaved,
  onDeleted,
}: {
  prompt: Prompt | null
  onSaved: (prompt: Prompt) => void
  onDeleted?: (id: string) => void
}) {
  const isNew = !prompt?.id
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(prompt?.slug ?? "")
  const [useCustomModel, setUseCustomModel] = useState(
    prompt ? !KNOWN_MODELS.some((m) => m.value === prompt.model) : false,
  )

  if (!prompt && !isNew) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a prompt from the sidebar to edit it.
      </div>
    )
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isNew) {
      setSlug(slugify(e.target.value))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const model = useCustomModel
      ? (form.get("customModel") as string)
      : (form.get("model") as string)

    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      systemPrompt: form.get("systemPrompt") as string,
      model,
      temperature: parseFloat(form.get("temperature") as string) || 0.7,
      maxTokens: parseInt(form.get("maxTokens") as string) || 1024,
      enabled: form.get("enabled") === "on",
      translations: {},
    }

    try {
      let result: Prompt
      if (isNew) {
        result = await createPrompt(data)
        toast.success(`Created ${data.name}`)
      } else {
        result = await updatePrompt(prompt!.id, data)
        toast.success(`Saved ${data.name}`)
      }
      onSaved(result)
    } catch {
      toast.error("Failed to save")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!prompt) return
    if (!confirm(`Delete "${prompt.name}"? This cannot be undone.`)) return

    setLoading(true)
    try {
      await deletePrompt(prompt.id)
      toast.success(`Deleted ${prompt.name}`)
      onDeleted?.(prompt.id)
    } catch {
      toast.error("Failed to delete")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      key={prompt?.id ?? "new"}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">
            {isNew ? "New Prompt" : prompt!.name}
          </h2>
          {prompt && (
            <Badge variant={prompt.enabled ? "success" : "secondary"} className="text-[10px]">
              {prompt.enabled ? "Enabled" : "Disabled"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={prompt?.name}
              required
              onChange={handleNameChange}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug" className="text-xs">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              readOnly={!isNew}
              className={!isNew ? "opacity-60" : ""}
            />
          </div>
        </div>

        {/* System Prompt */}
        <div className="flex flex-col gap-1.5 flex-1 min-h-0">
          <Label htmlFor="systemPrompt" className="text-xs">System Prompt</Label>
          <textarea
            id="systemPrompt"
            name="systemPrompt"
            defaultValue={prompt?.systemPrompt}
            required
            className="flex-1 min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y font-mono leading-relaxed"
            placeholder="You are..."
          />
        </div>

        <Separator />

        {/* Parameters */}
        <div className="grid grid-cols-4 gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="model" className="text-xs">Model</Label>
            {useCustomModel ? (
              <Input
                id="customModel"
                name="customModel"
                defaultValue={prompt?.model}
                placeholder="model-name"
              />
            ) : (
              <select
                id="model"
                name="model"
                defaultValue={
                  prompt?.model && KNOWN_MODELS.some((m) => m.value === prompt.model)
                    ? prompt.model
                    : KNOWN_MODELS[0].value
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {KNOWN_MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              className="text-[10px] text-muted-foreground hover:text-foreground text-start"
              onClick={() => setUseCustomModel(!useCustomModel)}
            >
              {useCustomModel ? "← Use known model" : "Custom model..."}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="temperature" className="text-xs">Temperature</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              defaultValue={prompt?.temperature ?? 0.7}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="maxTokens" className="text-xs">Max Tokens</Label>
            <Input
              id="maxTokens"
              name="maxTokens"
              type="number"
              step="1"
              min="1"
              defaultValue={prompt?.maxTokens ?? 1024}
            />
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={prompt?.enabled ?? true}
            />
            <Label htmlFor="enabled" className="text-xs">Enabled</Label>
          </div>
        </div>
      </div>
    </form>
  )
}
