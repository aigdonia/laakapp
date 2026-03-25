"use client"

import { useState } from "react"
import type { Country, Language } from "@fin-ai/shared"
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
import { LocaleInput } from "@/components/locale-input"
import { extractTranslations } from "@/lib/translations"
import { createCountry, updateCountry } from "./actions"
import { toast } from "sonner"

export function CountryForm({
  open,
  onOpenChange,
  country,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  country?: Country
  languages: Language[]
}) {
  const isEditing = !!country
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      code: (form.get("code") as string).toUpperCase(),
      currency: (form.get("currency") as string).toUpperCase(),
      flagEmoji: form.get("flagEmoji") as string,
      enabled: form.get("enabled") === "on",
      translations: extractTranslations(form, ["name"]),
    }

    try {
      if (isEditing) {
        await updateCountry(country.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createCountry(data)
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
          <SheetTitle>{isEditing ? "Edit Country" : "Add Country"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the country details below."
              : "Fill in the details for the new country."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <LocaleInput
            field="name"
            label="Name"
            languages={languages}
            defaultValue={country?.name}
            translations={country?.translations}
            required
            placeholder="Egypt"
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              placeholder="EG"
              maxLength={3}
              defaultValue={country?.code}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              placeholder="EGP"
              maxLength={3}
              defaultValue={country?.currency}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="flagEmoji">Flag Emoji</Label>
            <Input
              id="flagEmoji"
              name="flagEmoji"
              placeholder="🇪🇬"
              defaultValue={country?.flagEmoji}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={country?.enabled ?? true}
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
