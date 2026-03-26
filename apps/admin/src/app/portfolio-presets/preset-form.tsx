"use client"

import { useState } from "react"
import type {
  AssetClass,
  Language,
  PortfolioPreset,
  PortfolioPresetAllocations,
} from "@fin-ai/shared"
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
import { createPortfolioPreset, updatePortfolioPreset } from "./actions"
import { toast } from "sonner"
import { IconPlus, IconTrash } from "@tabler/icons-react"

type Allocation = { slug: string; pct: number }

function allocationsToRows(
  allocs?: PortfolioPresetAllocations
): Allocation[] {
  if (!allocs) return []
  return Object.entries(allocs).map(([slug, pct]) => ({ slug, pct }))
}

function rowsToAllocations(rows: Allocation[]): PortfolioPresetAllocations {
  const result: PortfolioPresetAllocations = {}
  for (const row of rows) {
    if (row.slug) result[row.slug] = row.pct
  }
  return result
}

export function PresetForm({
  open,
  onOpenChange,
  preset,
  languages,
  assetClasses,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  preset?: PortfolioPreset
  languages: Language[]
  assetClasses: AssetClass[]
}) {
  const isEditing = !!preset
  const [loading, setLoading] = useState(false)
  const [allocations, setAllocations] = useState<Allocation[]>(
    allocationsToRows(preset?.allocations)
  )

  const total = allocations.reduce((sum, a) => sum + (a.pct || 0), 0)
  const usedSlugs = new Set(allocations.map((a) => a.slug))

  function addRow() {
    setAllocations([...allocations, { slug: "", pct: 0 }])
  }

  function removeRow(index: number) {
    setAllocations(allocations.filter((_, i) => i !== index))
  }

  function updateRow(index: number, field: keyof Allocation, value: string | number) {
    setAllocations(
      allocations.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (total !== 100) {
      toast.error("Allocations must sum to exactly 100%")
      return
    }

    const emptySlug = allocations.some((a) => !a.slug)
    if (emptySlug) {
      toast.error("All allocation rows must have an asset class selected")
      return
    }

    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      slug: (form.get("slug") as string).toLowerCase(),
      order: Number(form.get("order")) || 0,
      enabled: form.get("enabled") === "on",
      allocations: rowsToAllocations(allocations),
      translations: extractTranslations(form, ["name", "description"]),
    }

    try {
      if (isEditing) {
        await updatePortfolioPreset(preset.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createPortfolioPreset(data)
        toast.success(`Created ${data.name}`)
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
          setAllocations(allocationsToRows(preset?.allocations))
        }
        onOpenChange(o)
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Portfolio Preset" : "Add Portfolio Preset"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the portfolio preset details below."
              : "Fill in the details for the new portfolio preset."}
          </SheetDescription>
        </SheetHeader>

        <form key={preset?.id ?? "create"} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            <LocaleInput
              field="name"
              label="Name"
              languages={languages}
              defaultValue={preset?.name}
              translations={preset?.translations}
              required
              placeholder="Conservative"
            />

            <LocaleInput
              field="description"
              label="Description"
              languages={languages}
              defaultValue={preset?.description}
              translations={preset?.translations}
              placeholder="A low-risk allocation focused on stability"
            />

            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="conservative"
                defaultValue={preset?.slug}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                placeholder="0"
                defaultValue={preset?.order ?? 0}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                id="enabled"
                name="enabled"
                defaultChecked={preset?.enabled ?? true}
              />
            </div>

            {/* Allocations Editor */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Allocations</Label>
                <span
                  className={`text-xs font-medium ${
                    total === 100
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  Total: {total}%
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {allocations.map((row, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      value={row.slug}
                      onChange={(e) => updateRow(index, "slug", e.target.value)}
                      className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="">Select asset class...</option>
                      {assetClasses
                        .filter((ac) => ac.enabled)
                        .map((ac) => (
                          <option
                            key={ac.slug}
                            value={ac.slug}
                            disabled={usedSlugs.has(ac.slug) && row.slug !== ac.slug}
                          >
                            {ac.name}
                          </option>
                        ))}
                    </select>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={row.pct}
                      onChange={(e) =>
                        updateRow(index, "pct", Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeRow(index)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRow}
                className="self-start"
              >
                <IconPlus data-icon="inline-start" />
                Add Row
              </Button>
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
