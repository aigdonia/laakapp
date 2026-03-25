"use client"

import { useState } from "react"
import type { Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { createLanguage, updateLanguage } from "./actions"
import { toast } from "sonner"

export function LanguageForm({
  open,
  onOpenChange,
  language,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  language?: Language
}) {
  const isEditing = !!language
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      code: (form.get("code") as string).toLowerCase(),
      nativeName: form.get("nativeName") as string,
      direction: form.get("direction") as "ltr" | "rtl",
      enabled: form.get("enabled") === "on",
    }

    try {
      if (isEditing) {
        await updateLanguage(language.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createLanguage(data)
        toast.success(`Created ${data.name}`)
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
            {isEditing ? "Edit Language" : "Add Language"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the language details below."
              : "Fill in the details for the new language."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Arabic"
              defaultValue={language?.name}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="ar"
              maxLength={5}
              defaultValue={language?.code}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="nativeName">Native Name</Label>
            <Input
              id="nativeName"
              name="nativeName"
              placeholder="العربية"
              defaultValue={language?.nativeName}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="direction">Direction</Label>
            <select
              id="direction"
              name="direction"
              defaultValue={language?.direction ?? "ltr"}
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="ltr">Left to Right (LTR)</option>
              <option value="rtl">Right to Left (RTL)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={language?.enabled ?? true}
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
