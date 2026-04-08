"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AssetClass, Language } from "@fin-ai/shared"
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
import { deleteAssetClass, reorderAssetClasses } from "./actions"
import { AssetClassForm } from "./asset-class-form"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"

export function AssetClassesTable({
  assetClasses,
  languages,
  lookupCategories = [],
}: {
  assetClasses: AssetClass[]
  languages: Language[]
  lookupCategories?: string[]
}) {
  const router = useRouter()
  const sorted = [...assetClasses].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [editingAssetClass, setEditingAssetClass] =
    useState<AssetClass | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(assetClass: AssetClass) {
    try {
      await deleteAssetClass(assetClass.id)
      router.refresh()
      toast.success(`Deleted ${assetClass.name}`)
    } catch {
      toast.error("Failed to delete asset class")
    }
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderAssetClasses(newIds).then(() => {
      router.refresh()
    }).catch(() => {
      toast.error("Failed to save order")
      setItems(sorted)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Asset Class
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
                <th className="px-4 py-3 text-start font-medium">Icon</th>
                <th className="px-4 py-3 text-start font-medium">Fields</th>
                <th className="px-4 py-3 text-start font-medium">Status</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No asset classes yet. Add your first asset class.
                  </td>
                </tr>
              )}
              {items.map((assetClass) => (
                <SortableRow
                  key={assetClass.id}
                  id={assetClass.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={assetClass.id} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <button type="button" className="hover:underline text-start inline-flex items-center gap-2" onClick={() => setEditingAssetClass(assetClass)}>
                      <span
                        className="size-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: assetClass.color }}
                      />
                      {assetClass.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">
                    {assetClass.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {assetClass.icon}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {assetClass.fields?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={assetClass.enabled ? "success" : "secondary"}
                    >
                      {assetClass.enabled ? "Enabled" : "Disabled"}
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
                          onClick={() => setEditingAssetClass(assetClass)}
                        >
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(assetClass)}
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

      <AssetClassForm open={showCreate} onOpenChange={setShowCreate} languages={languages} lookupCategories={lookupCategories} />

      <AssetClassForm
        key={editingAssetClass?.id}
        open={!!editingAssetClass}
        onOpenChange={(open) => {
          if (!open) setEditingAssetClass(null)
        }}
        assetClass={editingAssetClass ?? undefined}
        languages={languages}
        lookupCategories={lookupCategories}
      />
    </>
  )
}
