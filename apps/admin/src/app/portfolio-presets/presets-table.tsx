"use client"

import { useState } from "react"
import type { AssetClass, Language, PortfolioPreset } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deletePortfolioPreset, reorderPortfolioPresets } from "./actions"
import { PresetForm } from "./preset-form"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"

export function PresetsTable({
  presets,
  languages,
  assetClasses,
}: {
  presets: PortfolioPreset[]
  languages: Language[]
  assetClasses: AssetClass[]
}) {
  const sorted = [...presets].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [editingPreset, setEditingPreset] = useState<PortfolioPreset | null>(
    null
  )
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(preset: PortfolioPreset) {
    try {
      await deletePortfolioPreset(preset.id)
      toast.success(`Deleted ${preset.name}`)
    } catch {
      toast.error("Failed to delete preset")
    }
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderPortfolioPresets(newIds).catch(() => {
      toast.error("Failed to save order")
      setItems(sorted)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Preset
        </Button>
      </div>

      <SortableTableProvider
        ids={items.map((i) => i.id)}
        onReorder={handleReorder}
      >
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground">
                <th className="w-10 px-2 py-3" />
                <th className="px-4 py-3 text-start font-medium">Name</th>
                <th className="px-4 py-3 text-start font-medium">Slug</th>
                <th className="px-4 py-3 text-start font-medium">
                  Allocations
                </th>
                <th className="px-4 py-3 text-start font-medium">Status</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No portfolio presets yet. Add your first preset.
                  </td>
                </tr>
              )}
              {items.map((preset) => (
                <SortableRow
                  key={preset.id}
                  id={preset.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={preset.id} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <button type="button" className="hover:underline text-start" onClick={() => setEditingPreset(preset)}>
                      {preset.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">
                    {preset.slug}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(preset.allocations ?? {}).map(
                        ([slug, pct]) => (
                          <span
                            key={slug}
                            className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                          >
                            {slug}: {pct}%
                          </span>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={preset.enabled ? "success" : "secondary"}
                    >
                      {preset.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" />}
                      >
                        <IconDots className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingPreset(preset)}
                        >
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(preset)}
                        >
                          <IconTrash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </SortableRow>
              ))}
            </tbody>
          </table>
        </div>
      </SortableTableProvider>

      <PresetForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
        assetClasses={assetClasses}
      />

      <PresetForm
        key={editingPreset?.id}
        open={!!editingPreset}
        onOpenChange={(open) => {
          if (!open) setEditingPreset(null)
        }}
        preset={editingPreset ?? undefined}
        languages={languages}
        assetClasses={assetClasses}
      />
    </>
  )
}
