"use client"

import { useState } from "react"
import type { MicroLesson, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { RichEditor } from "@/components/rich-editor"
import { createMicroLesson, updateMicroLesson } from "./actions"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export function MicroLessonForm({
  open,
  onOpenChange,
  microLesson,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  microLesson?: MicroLesson
  languages: Language[]
}) {
  const isEditing = !!microLesson
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(microLesson?.slug ?? "")
  const [content, setContent] = useState(microLesson?.content ?? "")

  function handleTitleChange(title: string) {
    if (!isEditing) {
      setSlug(slugify(title))
    }
  }

  function resetForm() {
    setSlug(microLesson?.slug ?? "")
    setContent(microLesson?.content ?? "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const data = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      content,
      concept: form.get("concept") as string,
      languageCode: form.get("languageCode") as string,
      order: Number(form.get("order")) || 0,
    }

    try {
      if (isEditing) {
        await updateMicroLesson(microLesson.id, data)
        toast.success(`Updated ${data.title}`)
      } else {
        await createMicroLesson(data)
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
            {isEditing ? "Edit Micro Lesson" : "Add Micro Lesson"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the micro lesson details below."
              : "Fill in the details for the new micro lesson."}
          </SheetDescription>
        </SheetHeader>

        <form key={microLesson?.id ?? "create"} onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Understanding Riba"
              defaultValue={microLesson?.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="understanding-riba"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Content</Label>
            <RichEditor content={content} onChange={setContent} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="concept">Concept</Label>
            <Input
              id="concept"
              name="concept"
              placeholder="Riba (Interest)"
              defaultValue={microLesson?.concept}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="languageCode">Language</Label>
            <select
              id="languageCode"
              name="languageCode"
              defaultValue={microLesson?.languageCode ?? languages[0]?.code}
              className={selectClass}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              name="order"
              type="number"
              placeholder="0"
              defaultValue={microLesson?.order ?? 0}
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
