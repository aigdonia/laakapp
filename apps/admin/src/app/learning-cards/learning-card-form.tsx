"use client"

import { useState } from "react"
import type { LearningCard, Language } from "@fin-ai/shared"
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
import { createLearningCard, updateLearningCard } from "./actions"
import { toast } from "sonner"

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export function LearningCardForm({
  open,
  onOpenChange,
  learningCard,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  learningCard?: LearningCard
  languages: Language[]
}) {
  const isEditing = !!learningCard
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(learningCard?.content ?? "")

  function resetForm() {
    setContent(learningCard?.content ?? "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const data = {
      title: form.get("title") as string,
      content,
      trigger: form.get("trigger") as string,
      condition: form.get("condition") as string,
      languageCode: form.get("languageCode") as string,
      order: Number(form.get("order")) || 0,
    }

    try {
      if (isEditing) {
        await updateLearningCard(learningCard.id, data)
        toast.success(`Updated ${data.title}`)
      } else {
        await createLearningCard(data)
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
            {isEditing ? "Edit Learning Card" : "Add Learning Card"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the learning card details below."
              : "Fill in the details for the new learning card."}
          </SheetDescription>
        </SheetHeader>

        <form key={learningCard?.id ?? "create"} onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="What is Zakat?"
              defaultValue={learningCard?.title}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Content</Label>
            <RichEditor content={content} onChange={setContent} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="trigger">Trigger</Label>
            <Input
              id="trigger"
              name="trigger"
              placeholder="portfolio_view"
              defaultValue={learningCard?.trigger}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="condition">Condition</Label>
            <Input
              id="condition"
              name="condition"
              placeholder="first_time_user"
              defaultValue={learningCard?.condition}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="languageCode">Language</Label>
            <select
              id="languageCode"
              name="languageCode"
              defaultValue={learningCard?.languageCode ?? languages[0]?.code}
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
              defaultValue={learningCard?.order ?? 0}
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
