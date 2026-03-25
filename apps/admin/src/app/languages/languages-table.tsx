"use client"

import { useState } from "react"
import type { Language } from "@fin-ai/shared"
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
import { deleteLanguage } from "./actions"
import { LanguageForm } from "./language-form"
import { toast } from "sonner"

export function LanguagesTable({ languages }: { languages: Language[] }) {
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(language: Language) {
    try {
      await deleteLanguage(language.id)
      toast.success(`Deleted ${language.name}`)
    } catch {
      toast.error("Failed to delete language")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Language
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Language</th>
              <th className="px-4 py-3 text-start font-medium">Code</th>
              <th className="px-4 py-3 text-start font-medium">Native Name</th>
              <th className="px-4 py-3 text-start font-medium">Direction</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {languages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No languages yet. Add your first language.
                </td>
              </tr>
            )}
            {languages.map((language) => (
              <tr key={language.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{language.name}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono">
                  {language.code}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {language.nativeName}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={language.direction === "rtl" ? "default" : "outline"}>
                    {language.direction.toUpperCase()}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={language.enabled ? "success" : "secondary"}>
                    {language.enabled ? "Enabled" : "Disabled"}
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
                        onClick={() => setEditingLanguage(language)}
                      >
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(language)}
                      >
                        <IconTrash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LanguageForm
        open={showCreate}
        onOpenChange={setShowCreate}
      />

      <LanguageForm
        key={editingLanguage?.id}
        open={!!editingLanguage}
        onOpenChange={(open) => {
          if (!open) setEditingLanguage(null)
        }}
        language={editingLanguage ?? undefined}
      />
    </>
  )
}
