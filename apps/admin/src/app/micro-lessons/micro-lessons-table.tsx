"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { MicroLesson, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deleteMicroLesson, reorderMicroLessons } from "./actions"
import { MicroLessonForm } from "./micro-lesson-form"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"

export function MicroLessonsTable({
  microLessons,
  languages,
}: {
  microLessons: MicroLesson[]
  languages: Language[]
}) {
  const router = useRouter()
  const sorted = [...microLessons].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [editingLesson, setEditingLesson] = useState<MicroLesson | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(lesson: MicroLesson) {
    try {
      await deleteMicroLesson(lesson.id)
      router.refresh()
      toast.success(`Deleted ${lesson.title}`)
    } catch {
      toast.error("Failed to delete micro lesson")
    }
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderMicroLessons(newIds).then(() => {
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
          Add Micro Lesson
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
                <th className="px-4 py-3 text-start font-medium">Title</th>
                <th className="px-4 py-3 text-start font-medium">Slug</th>
                <th className="px-4 py-3 text-start font-medium">Concept</th>
                <th className="px-4 py-3 text-start font-medium">Language</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No micro lessons yet. Add your first micro lesson.
                  </td>
                </tr>
              )}
              {items.map((lesson) => (
                <SortableRow
                  key={lesson.id}
                  id={lesson.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={lesson.id} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <button type="button" className="hover:underline text-start" onClick={() => setEditingLesson(lesson)}>
                      {lesson.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lesson.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lesson.concept}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {languages.find((l) => l.code === lesson.languageCode)?.name ?? lesson.languageCode}
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
                          onClick={() => setEditingLesson(lesson)}
                        >
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(lesson)}
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

      <MicroLessonForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <MicroLessonForm
        key={editingLesson?.id}
        open={!!editingLesson}
        onOpenChange={(open) => {
          if (!open) setEditingLesson(null)
        }}
        microLesson={editingLesson ?? undefined}
        languages={languages}
      />
    </>
  )
}
