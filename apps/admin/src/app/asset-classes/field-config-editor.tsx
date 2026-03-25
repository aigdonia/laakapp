"use client"

import type { FieldConfig, FieldType } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPlus, IconTrash } from "@tabler/icons-react"

const BUILT_IN_TYPES: { label: string; value: FieldType }[] = [
  { label: "Number", value: "number" },
  { label: "Text", value: "text" },
  { label: "Segment", value: "segment" },
  { label: "Date", value: "date" },
]

const ENTITY_TYPES: { label: string; value: FieldType }[] = [
  { label: "Stock", value: "stock" },
  { label: "ETF", value: "etf" },
]

function emptyField(): FieldConfig {
  return { key: "", label: "", type: "text" }
}

function emptyOption() {
  return { label: "", value: "" }
}

/** Pretty-print a lookup category slug: "gold-units" → "Gold Units" */
function formatCategory(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function FieldConfigEditor({
  fields,
  onChange,
  lookupCategories = [],
}: {
  fields: FieldConfig[]
  onChange: (fields: FieldConfig[]) => void
  lookupCategories?: string[]
}) {
  function updateField(index: number, patch: Partial<FieldConfig>) {
    onChange(
      fields.map((f, i) => (i === index ? { ...f, ...patch } : f))
    )
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index))
  }

  function addField() {
    onChange([...fields, emptyField()])
  }

  function updateOption(
    fieldIndex: number,
    optIndex: number,
    key: "label" | "value",
    val: string
  ) {
    const field = fields[fieldIndex]
    const options = (field.options ?? []).map((o, i) =>
      i === optIndex ? { ...o, [key]: val } : o
    )
    updateField(fieldIndex, { options })
  }

  function addOption(fieldIndex: number) {
    const field = fields[fieldIndex]
    updateField(fieldIndex, {
      options: [...(field.options ?? []), emptyOption()],
    })
  }

  function removeOption(fieldIndex: number, optIndex: number) {
    const field = fields[fieldIndex]
    updateField(fieldIndex, {
      options: (field.options ?? []).filter((_, i) => i !== optIndex),
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>Fields</Label>
        <Button type="button" variant="ghost" size="icon-xs" onClick={addField}>
          <IconPlus className="size-4" />
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground py-2">
          No fields configured. Add fields to define the form for this asset type.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {fields.map((field, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border p-3 bg-muted/30"
          >
            {/* Row 1: Key, Label, Type, Delete */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="key"
                value={field.key}
                onChange={(e) => updateField(i, { key: e.target.value })}
                className="w-28 font-mono text-xs"
              />
              <Input
                placeholder="Label"
                value={field.label}
                onChange={(e) => updateField(i, { label: e.target.value })}
                className="flex-1"
              />
              <select
                value={field.type}
                onChange={(e) => {
                  const type = e.target.value as FieldType
                  const patch: Partial<FieldConfig> = { type }
                  if (type === "segment" && !field.options?.length) {
                    patch.options = [emptyOption()]
                  }
                  if (type !== "segment") {
                    patch.options = undefined
                  }
                  updateField(i, patch)
                }}
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <optgroup label="Built-in">
                  {BUILT_IN_TYPES.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Entities">
                  {ENTITY_TYPES.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </optgroup>
                {lookupCategories.length > 0 && (
                  <optgroup label="Lookups">
                    {lookupCategories.map((cat) => (
                      <option key={cat} value={`lookup:${cat}`}>
                        {formatCategory(cat)}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => removeField(i)}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>

            {/* Row 2: Placeholder, Suffix, Required, Advanced */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Placeholder"
                value={field.placeholder ?? ""}
                onChange={(e) =>
                  updateField(i, {
                    placeholder: e.target.value || undefined,
                  })
                }
                className="flex-1 text-xs"
              />
              <Input
                placeholder="Suffix"
                value={field.suffix ?? ""}
                onChange={(e) =>
                  updateField(i, {
                    suffix: e.target.value || undefined,
                  })
                }
                className="w-20 text-xs"
              />
              <label className="flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required ?? false}
                  onChange={(e) =>
                    updateField(i, {
                      required: e.target.checked || undefined,
                    })
                  }
                  className="accent-primary"
                />
                Req
              </label>
              <label className="flex items-center gap-1 text-xs whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.advanced ?? false}
                  onChange={(e) =>
                    updateField(i, {
                      advanced: e.target.checked || undefined,
                    })
                  }
                  className="accent-primary"
                />
                Adv
              </label>
            </div>

            {/* Row 3: Segment inline options — only for type="segment" */}
            {field.type === "segment" && (
              <div className="flex flex-col gap-1.5 pt-1 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Options
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => addOption(i)}
                  >
                    <IconPlus className="size-3" />
                  </Button>
                </div>
                {(field.options ?? []).map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-1.5">
                    <Input
                      placeholder="Label"
                      value={opt.label}
                      onChange={(e) =>
                        updateOption(i, oi, "label", e.target.value)
                      }
                      className="flex-1 text-xs h-7"
                    />
                    <Input
                      placeholder="Value"
                      value={opt.value}
                      onChange={(e) =>
                        updateOption(i, oi, "value", e.target.value)
                      }
                      className="flex-1 text-xs h-7 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeOption(i, oi)}
                      disabled={(field.options?.length ?? 0) <= 1}
                    >
                      <IconTrash className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Lookup type hint */}
            {field.type.startsWith("lookup:") && (
              <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                Options from lookup: <span className="font-medium">{formatCategory(field.type.replace("lookup:", ""))}</span>
              </p>
            )}

            {/* Entity type hint */}
            {(field.type === "stock" || field.type === "etf") && (
              <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                Renders as searchable picker on mobile
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
