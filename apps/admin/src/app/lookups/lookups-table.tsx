"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Language, Lookup } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { createLookup, updateLookup, deleteLookup } from "./actions"
import { LookupForm } from "./lookup-form"
import { toast } from "sonner"

type LookupRow = {
  id?: string
  label: string
  value: string
  metadata: Record<string, string>
  enabled: boolean
  order: number
}

function formatCategory(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function rowsFromItems(items: Lookup[]): LookupRow[] {
  return items.map((l) => ({
    id: l.id,
    label: l.label,
    value: l.value,
    metadata: l.metadata ?? {},
    enabled: l.enabled,
    order: l.order,
  }))
}

function CategoryCard({
  category,
  items,
  languages,
  allCategories,
}: {
  category: string
  items: Lookup[]
  languages: Language[]
  allCategories: string[]
}) {
  const router = useRouter()
  const [rows, setRows] = useState<LookupRow[]>(() => rowsFromItems(items))
  const [saving, setSaving] = useState(false)
  const [editingLookup, setEditingLookup] = useState<Lookup | null>(null)

  const isDirty = useMemo(() => {
    if (rows.length !== items.length) return true
    return rows.some((r) => {
      if (!r.id) return true
      const orig = items.find((l) => l.id === r.id)
      if (!orig) return true
      return r.label !== orig.label || r.value !== orig.value
    })
  }, [rows, items])

  const hasEmptyRows = rows.some((r) => !r.label.trim() || !r.value.trim())

  function addRow() {
    setRows([
      ...rows,
      { label: "", value: "", metadata: {}, enabled: true, order: rows.length },
    ])
  }

  function updateRow(index: number, patch: Partial<LookupRow>) {
    setRows(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const existingIds = new Set(rows.filter((r) => r.id).map((r) => r.id!))
      const deletedItems = items.filter((l) => !existingIds.has(l.id))

      await Promise.all(deletedItems.map((l) => deleteLookup(l.id)))

      await Promise.all(
        rows.map(async (r, i) => {
          const data = {
            category,
            label: r.label,
            value: r.value,
            metadata: r.metadata,
            enabled: r.enabled,
            order: i,
            translations: {} as Record<string, Record<string, string>>,
          }
          if (r.id) {
            await updateLookup(r.id, data)
          } else {
            await createLookup(data)
          }
        }),
      )

      router.refresh()
      toast.success(`Saved ${formatCategory(category)}`)
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg border p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{formatCategory(category)}</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={addRow}
          >
            <IconPlus className="size-4" />
          </Button>
        </div>

        {rows.length === 0 && (
          <p className="text-xs text-muted-foreground py-1">
            No values yet. Click + to add one.
          </p>
        )}

        {rows.map((row, i) => (
          <div key={row.id ?? `new-${i}`} className="flex items-center gap-1.5">
            <Input
              placeholder="Label"
              value={row.label}
              onChange={(e) => updateRow(i, { label: e.target.value })}
              className="flex-1 text-xs h-7"
            />
            <Input
              placeholder="value"
              value={row.value}
              onChange={(e) => updateRow(i, { value: e.target.value })}
              className="flex-1 text-xs h-7 font-mono"
            />
            {row.id && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                title="Advanced edit (metadata, translations)"
                onClick={() => {
                  const orig = items.find((l) => l.id === row.id)
                  if (orig) setEditingLookup(orig)
                }}
              >
                <IconPencil className="size-3" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => removeRow(i)}
            >
              <IconTrash className="size-3" />
            </Button>
          </div>
        ))}

        {isDirty && (
          <Button
            size="sm"
            variant="outline"
            className="self-end mt-1"
            disabled={saving || hasEmptyRows}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>

      <LookupForm
        key={editingLookup?.id}
        open={!!editingLookup}
        onOpenChange={(open) => {
          if (!open) setEditingLookup(null)
        }}
        lookup={editingLookup ?? undefined}
        languages={languages}
        categories={allCategories}
      />
    </>
  )
}

export function LookupsTable({
  lookups,
  languages,
}: {
  lookups: Lookup[]
  languages: Language[]
}) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [localCategories, setLocalCategories] = useState<string[]>([])

  const grouped = useMemo(() => {
    const map = new Map<string, Lookup[]>()
    const sorted = [...lookups].sort((a, b) => a.order - b.order)
    for (const item of sorted) {
      const list = map.get(item.category) ?? []
      list.push(item)
      map.set(item.category, list)
    }
    for (const cat of localCategories) {
      if (!map.has(cat)) map.set(cat, [])
    }
    return map
  }, [lookups, localCategories])

  const categories = useMemo(() => [...grouped.keys()].sort(), [grouped])

  function addCategory() {
    const slug = newCategoryName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
    if (!slug || categories.includes(slug)) return
    setLocalCategories([...localCategories, slug])
    setNewCategoryName("")
    setShowNewCategory(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        {showNewCategory ? (
          <div className="flex items-center gap-2">
            <Input
              placeholder="category-slug"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              className="w-48 text-sm font-mono"
              autoFocus
            />
            <Button
              size="sm"
              onClick={addCategory}
              disabled={!newCategoryName.trim()}
            >
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowNewCategory(false)
                setNewCategoryName("")
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => setShowNewCategory(true)}>
            <IconPlus data-icon="inline-start" />
            Add Category
          </Button>
        )}
      </div>

      {categories.length === 0 && (
        <div className="rounded-lg border px-4 py-8 text-center text-muted-foreground">
          No lookup categories yet. Create one to get started.
        </div>
      )}

      {categories.map((cat) => {
        const items = grouped.get(cat) ?? []
        return (
          <CategoryCard
            key={`${cat}-${items.map((l) => l.id).join(",")}`}
            category={cat}
            items={items}
            languages={languages}
            allCategories={categories}
          />
        )
      })}
    </div>
  )
}
