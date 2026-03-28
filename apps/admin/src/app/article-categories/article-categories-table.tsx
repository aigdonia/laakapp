"use client"

import { useState } from "react"
import type { ArticleCategory, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import {
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
  reorderArticleCategories,
} from "./actions"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"
import { LocaleInput } from "@/components/locale-input"
import { extractTranslations } from "@/lib/translations"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function CategoryForm({
  open,
  onOpenChange,
  category,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: ArticleCategory
  languages: Language[]
}) {
  const isEditing = !!category
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(category?.slug ?? "")

  function handleTitleChange(title: string) {
    if (!isEditing) {
      setSlug(slugify(title))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const translations = extractTranslations(form, ["title"])
    const data = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      icon: (form.get("icon") as string) || "📄",
      enabled: form.get("enabled") === "on",
      translations,
    }

    try {
      if (isEditing) {
        await updateArticleCategory(category.id, data)
        toast.success(`Updated ${data.title}`)
      } else {
        await createArticleCategory(data)
        toast.success(`Created ${data.title}`)
      }
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Category" : "Add Category"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the category details below."
              : "Fill in the details for the new category."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <LocaleInput
            field="title"
            label="Title"
            languages={languages}
            defaultValue={category?.title}
            translations={category?.translations}
            required
            placeholder="Understanding Halal Screening"
            onChange={(e) => handleTitleChange(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="halal-screening"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input
              id="icon"
              name="icon"
              placeholder="📄"
              defaultValue={category?.icon ?? "📄"}
              className="text-xl"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={category?.enabled ?? true}
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

export function ArticleCategoriesTable({
  categories,
  languages,
}: {
  categories: ArticleCategory[]
  languages: Language[]
}) {
  const sorted = [...categories].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [editingCategory, setEditingCategory] =
    useState<ArticleCategory | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(category: ArticleCategory) {
    try {
      await deleteArticleCategory(category.id)
      toast.success(`Deleted ${category.title}`)
    } catch {
      toast.error("Failed to delete category")
    }
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderArticleCategories(newIds).catch(() => {
      toast.error("Failed to save order")
      setItems(sorted)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Category
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
                <th className="px-4 py-3 text-start font-medium">Icon</th>
                <th className="px-4 py-3 text-start font-medium">Title</th>
                <th className="px-4 py-3 text-start font-medium">Slug</th>
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
                    No categories yet. Add your first category.
                  </td>
                </tr>
              )}
              {items.map((cat) => (
                <SortableRow
                  key={cat.id}
                  id={cat.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={cat.id} />
                  </td>
                  <td className="px-4 py-3 text-xl">{cat.icon}</td>
                  <td className="px-4 py-3 font-medium">
                    <button type="button" className="hover:underline text-start" onClick={() => setEditingCategory(cat)}>
                      {cat.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.enabled ? "success" : "secondary"}>
                      {cat.enabled ? "Enabled" : "Disabled"}
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
                          onClick={() => setEditingCategory(cat)}
                        >
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(cat)}
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

      <CategoryForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <CategoryForm
        key={editingCategory?.id}
        open={!!editingCategory}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null)
        }}
        category={editingCategory ?? undefined}
        languages={languages}
      />
    </>
  )
}
