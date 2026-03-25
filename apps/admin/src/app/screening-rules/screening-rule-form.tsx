"use client"

import { useState } from "react"
import type { ScreeningRule, Language } from "@fin-ai/shared"
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
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { LocaleInput } from "@/components/locale-input"
import { extractTranslations } from "@/lib/translations"
import { createScreeningRule, updateScreeningRule } from "./actions"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

type ThresholdRow = { key: string; value: string }

function toRows(thresholds: Record<string, number>): ThresholdRow[] {
  const entries = Object.entries(thresholds)
  return entries.length > 0
    ? entries.map(([key, value]) => ({ key, value: String(value) }))
    : [{ key: "", value: "" }]
}

export function ScreeningRuleForm({
  open,
  onOpenChange,
  rule,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: ScreeningRule
  languages: Language[]
}) {
  const isEditing = !!rule
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(rule?.slug ?? "")
  const [thresholds, setThresholds] = useState<ThresholdRow[]>(
    rule ? toRows(rule.thresholds) : [{ key: "", value: "" }]
  )

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEditing) {
      setSlug(slugify(e.target.value))
    }
  }

  function updateThreshold(index: number, field: "key" | "value", val: string) {
    setThresholds((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    )
  }

  function addThreshold() {
    setThresholds((prev) => [...prev, { key: "", value: "" }])
  }

  function removeThreshold(index: number) {
    setThresholds((prev) => prev.filter((_, i) => i !== index))
  }

  function resetForm() {
    setSlug(rule?.slug ?? "")
    setThresholds(rule ? toRows(rule.thresholds) : [{ key: "", value: "" }])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const parsedThresholds: Record<string, number> = {}
    for (const row of thresholds) {
      const key = row.key.trim()
      const value = parseFloat(row.value)
      if (key && !isNaN(value)) {
        parsedThresholds[key] = value
      }
    }

    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      methodology: form.get("methodology") as string,
      description: (form.get("description") as string) || "",
      thresholds: parsedThresholds,
      enabled: form.get("enabled") === "on",
      translations: extractTranslations(form, ["name", "description"]),
    }

    try {
      if (isEditing) {
        await updateScreeningRule(rule.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createScreeningRule(data)
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
        if (!o) resetForm()
        onOpenChange(o)
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Screening Rule" : "Add Screening Rule"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the screening rule details below."
              : "Fill in the details for the new screening rule."}
          </SheetDescription>
        </SheetHeader>

        <form key={rule?.id ?? "create"} onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <LocaleInput
            field="name"
            label="Name"
            languages={languages}
            defaultValue={rule?.name}
            translations={rule?.translations}
            required
            placeholder="AAOIFI Standard"
            onChange={handleNameChange}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="aaoifi-standard"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="methodology">Methodology</Label>
            <Input
              id="methodology"
              name="methodology"
              placeholder="AAOIFI"
              defaultValue={rule?.methodology}
              required
            />
          </div>

          <LocaleInput
            field="description"
            label="Description"
            languages={languages}
            defaultValue={rule?.description}
            translations={rule?.translations}
            placeholder="Brief description of this screening rule"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Thresholds</Label>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={addThreshold}
              >
                <IconPlus className="size-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {thresholds.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Key (e.g. debt_to_market_cap)"
                    value={row.key}
                    onChange={(e) => updateThreshold(i, "key", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => updateThreshold(i, "value", e.target.value)}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeThreshold(i)}
                    disabled={thresholds.length === 1}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={rule?.enabled ?? true}
            />
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
