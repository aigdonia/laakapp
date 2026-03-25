"use client"

import { useState, useId } from "react"
import type { AssetClass, FieldConfig, Language } from "@fin-ai/shared"
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
import { FieldConfigEditor } from "./field-config-editor"
import { createAssetClass, updateAssetClass } from "./actions"
import { toast } from "sonner"

export function AssetClassForm({
  open,
  onOpenChange,
  assetClass,
  languages,
  lookupCategories = [],
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetClass?: AssetClass
  languages: Language[]
  lookupCategories?: string[]
}) {
  const isEditing = !!assetClass
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState(assetClass?.color ?? "#6b7280")
  const [fields, setFields] = useState<FieldConfig[]>(assetClass?.fields ?? [])
  const [aggregationKeys, setAggregationKeys] = useState<string[]>(assetClass?.aggregationKeys ?? [])
  const colorId = useId()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      slug: (form.get("slug") as string).toLowerCase(),
      icon: form.get("icon") as string,
      color,
      order: Number(form.get("order")) || 0,
      enabled: form.get("enabled") === "on",
      fields,
      aggregationKeys,
      translations: extractTranslations(form, ["name"]),
    }

    try {
      if (isEditing) {
        await updateAssetClass(assetClass.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createAssetClass(data)
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
          setColor(assetClass?.color ?? "#6b7280")
          setFields(assetClass?.fields ?? [])
          setAggregationKeys(assetClass?.aggregationKeys ?? [])
        }
        onOpenChange(o)
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Asset Class" : "Add Asset Class"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the asset class details below."
              : "Fill in the details for the new asset class."}
          </SheetDescription>
        </SheetHeader>

        <form key={assetClass?.id ?? "create"} onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
          <LocaleInput
            field="name"
            label="Name"
            languages={languages}
            defaultValue={assetClass?.name}
            translations={assetClass?.translations}
            required
            placeholder="Stocks"
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="stocks"
              defaultValue={assetClass?.slug}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              name="icon"
              placeholder="chart-line"
              defaultValue={assetClass?.icon}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={colorId}>Color</Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor={colorId}
                className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-input shadow-xs"
              >
                <input
                  id={colorId}
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-[-25%] size-[150%] cursor-pointer border-0 p-0"
                />
              </label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#6b7280"
                className="font-mono text-xs"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              placeholder="0"
              defaultValue={assetClass?.order ?? 0}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={assetClass?.enabled ?? true}
            />
          </div>

          <FieldConfigEditor fields={fields} onChange={setFields} lookupCategories={lookupCategories} />

          {/* Aggregation Keys Picker */}
          {fields.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Aggregation Keys</Label>
              <p className="text-xs text-muted-foreground">
                Select which fields define a unique holding. Transactions with the same values for these fields will be grouped together.
              </p>
              <div className="flex flex-wrap gap-2">
                {fields
                  .filter((f) => f.key)
                  .map((f) => (
                    <label
                      key={f.key}
                      className="flex items-center gap-1.5 text-sm cursor-pointer rounded-md border px-2.5 py-1.5 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                    >
                      <input
                        type="checkbox"
                        checked={aggregationKeys.includes(f.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAggregationKeys([...aggregationKeys, f.key])
                          } else {
                            setAggregationKeys(aggregationKeys.filter((k) => k !== f.key))
                          }
                        }}
                        className="accent-primary"
                      />
                      {f.label || f.key}
                    </label>
                  ))}
              </div>
            </div>
          )}
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
