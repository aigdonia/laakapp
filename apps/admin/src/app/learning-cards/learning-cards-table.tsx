"use client"

import { useState } from "react"
import type { LearningCard, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deleteLearningCard, reorderLearningCards } from "./actions"
import { LearningCardForm } from "./learning-card-form"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"

export function LearningCardsTable({
  learningCards,
  languages,
}: {
  learningCards: LearningCard[]
  languages: Language[]
}) {
  const sorted = [...learningCards].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [editingCard, setEditingCard] = useState<LearningCard | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(card: LearningCard) {
    try {
      await deleteLearningCard(card.id)
      toast.success(`Deleted ${card.title}`)
    } catch {
      toast.error("Failed to delete learning card")
    }
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderLearningCards(newIds).catch(() => {
      toast.error("Failed to save order")
      setItems(sorted)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Learning Card
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
                <th className="px-4 py-3 text-start font-medium">Language</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No learning cards yet. Add your first learning card.
                  </td>
                </tr>
              )}
              {items.map((card) => (
                <SortableRow
                  key={card.id}
                  id={card.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={card.id} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <button type="button" className="hover:underline text-start" onClick={() => setEditingCard(card)}>
                      {card.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {languages.find((l) => l.code === card.languageCode)?.name ?? card.languageCode}
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
                          onClick={() => setEditingCard(card)}
                        >
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(card)}
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

      <LearningCardForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <LearningCardForm
        key={editingCard?.id}
        open={!!editingCard}
        onOpenChange={(open) => {
          if (!open) setEditingCard(null)
        }}
        learningCard={editingCard ?? undefined}
        languages={languages}
      />
    </>
  )
}
