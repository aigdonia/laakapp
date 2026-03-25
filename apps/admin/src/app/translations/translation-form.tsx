"use client"

import { useState } from "react"
import type { Language } from "@fin-ai/shared"
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
import { bulkUpsertTranslations } from "./actions"
import { toast } from "sonner"

const NAMESPACES = [
  "common",
  "portfolio",
  "screening",
  "learn",
  "settings",
  "onboarding",
  "errors",
]

export function TranslationForm({
  open,
  onOpenChange,
  languages,
  existingKey,
  existingNamespace,
  existingValues,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  languages: Language[]
  existingKey?: string
  existingNamespace?: string
  existingValues?: Record<string, string> // languageCode → value
}) {
  const isEditing = !!existingKey
  const [loading, setLoading] = useState(false)
  const enabledLanguages = languages.filter((l) => l.enabled)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const key = (form.get("key") as string).trim()
    const namespace = form.get("namespace") as string

    const items: Array<{
      key: string
      namespace: string
      languageCode: string
      value: string
    }> = []

    for (const lang of enabledLanguages) {
      const value = (form.get(`value_${lang.code}`) as string)?.trim()
      if (value) {
        items.push({ key, namespace, languageCode: lang.code, value })
      }
    }

    if (items.length === 0) {
      toast.error("Provide at least one translation value")
      setLoading(false)
      return
    }

    try {
      await bulkUpsertTranslations(items)
      toast.success(isEditing ? `Updated "${key}"` : `Created "${key}"`)
      onOpenChange(false)
    } catch {
      toast.error("Failed to save translations")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Key" : "Add Key"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update translation values for this key."
              : "Add a new translation key with values for each language."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              name="key"
              placeholder="add_holding"
              defaultValue={existingKey}
              readOnly={isEditing}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="namespace">Namespace</Label>
            <select
              id="namespace"
              name="namespace"
              defaultValue={existingNamespace ?? "common"}
              disabled={isEditing}
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {NAMESPACES.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
          </div>

          {enabledLanguages.map((lang) => (
            <div key={lang.code} className="flex flex-col gap-2">
              <Label htmlFor={`value_${lang.code}`}>
                {lang.name} ({lang.code})
              </Label>
              <Input
                id={`value_${lang.code}`}
                name={`value_${lang.code}`}
                placeholder={`Translation in ${lang.name}`}
                defaultValue={existingValues?.[lang.code] ?? ""}
                dir={lang.direction === "rtl" ? "rtl" : "ltr"}
              />
            </div>
          ))}

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
