"use client"

import { useState } from "react"
import type { Language, Lookup } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { LocaleInput } from "@/components/locale-input"
import { extractTranslations } from "@/lib/translations"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { createLookup, updateLookup } from "./actions"
import { toast } from "sonner"

export function LookupForm({
  open,
  onOpenChange,
  lookup,
  languages,
  categories,
  defaultCategory,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lookup?: Lookup
  languages: Language[]
  categories: string[]
  defaultCategory?: string
}) {
  const isEditing = !!lookup
  const [loading, setLoading] = useState(false)
  const [useNewCategory, setUseNewCategory] = useState(false)
  const [metadata, setMetadata] = useState<[string, string][]>(
    Object.entries(lookup?.metadata ?? {})
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const category = useNewCategory
      ? (form.get("newCategory") as string).toLowerCase().replace(/\s+/g, "-")
      : (form.get("category") as string)

    const metadataObj: Record<string, string> = {}
    for (const [k, v] of metadata) {
      if (k.trim()) metadataObj[k.trim()] = v
    }

    const data = {
      category,
      label: form.get("label") as string,
      value: form.get("value") as string,
      metadata: metadataObj,
      order: Number(form.get("order")) || 0,
      enabled: form.get("enabled") === "on",
      translations: extractTranslations(form, ["label"]),
    }

    try {
      if (isEditing) {
        await updateLookup(lookup.id, data)
        toast.success(`Updated ${data.label}`)
      } else {
        await createLookup(data)
        toast.success(`Created ${data.label}`)
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setMetadata(Object.entries(lookup?.metadata ?? {}))
          setUseNewCategory(false)
        }
        onOpenChange(o)
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Lookup" : "Add Lookup"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the lookup item details below."
              : "Fill in the details for the new lookup item."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category</Label>
                {!isEditing && categories.length > 0 && (
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setUseNewCategory(!useNewCategory)}
                  >
                    {useNewCategory ? "Use existing" : "Create new"}
                  </button>
                )}
              </div>
              {useNewCategory || categories.length === 0 ? (
                <Input
                  id="newCategory"
                  name="newCategory"
                  placeholder="e.g. currencies"
                  defaultValue={defaultCategory}
                  required
                />
              ) : (
                <select
                  id="category"
                  name="category"
                  defaultValue={defaultCategory ?? lookup?.category ?? categories[0]}
                  required
                  className="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Label with translations */}
            <LocaleInput
              field="label"
              label="Label"
              languages={languages}
              defaultValue={lookup?.label}
              translations={lookup?.translations}
              required
              placeholder="Egyptian Pound"
            />

            {/* Value */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                name="value"
                placeholder="EGP"
                defaultValue={lookup?.value}
                required
                className="font-mono"
              />
            </div>

            {/* Metadata key-value editor */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Metadata</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setMetadata([...metadata, ["", ""]])}
                >
                  <IconPlus className="size-4" />
                </Button>
              </div>
              {metadata.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No metadata. Add key-value pairs for extra data (e.g. symbol, flag).
                </p>
              )}
              {metadata.map(([key, val], i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Input
                    placeholder="key"
                    value={key}
                    onChange={(e) => {
                      const next = [...metadata]
                      next[i] = [e.target.value, val]
                      setMetadata(next)
                    }}
                    className="w-28 text-xs font-mono"
                  />
                  <Input
                    placeholder="value"
                    value={val}
                    onChange={(e) => {
                      const next = [...metadata]
                      next[i] = [key, e.target.value]
                      setMetadata(next)
                    }}
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setMetadata(metadata.filter((_, j) => j !== i))}
                  >
                    <IconTrash className="size-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                placeholder="0"
                defaultValue={lookup?.order ?? 0}
              />
            </div>

            {/* Enabled */}
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                name="enabled"
                defaultChecked={lookup?.enabled ?? true}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
