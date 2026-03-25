"use client"

import { useState } from "react"
import type { Stock, Language } from "@fin-ai/shared"
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
import { createStock, updateStock } from "./actions"
import { toast } from "sonner"

export function StockForm({
  open,
  onOpenChange,
  stock,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stock?: Stock
  languages: Language[]
}) {
  const isEditing = !!stock
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      symbol: (form.get("symbol") as string).toUpperCase(),
      name: form.get("name") as string,
      countryCode: (form.get("countryCode") as string).toUpperCase(),
      exchange: form.get("exchange") as string,
      sector: form.get("sector") as string,
      enabled: form.get("enabled") === "on",
      translations: extractTranslations(form, ["name", "sector"]),
    }

    try {
      if (isEditing) {
        await updateStock(stock.id, data)
        toast.success(`Updated ${data.symbol}`)
      } else {
        await createStock(data)
        toast.success(`Created ${data.symbol}`)
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
          <SheetTitle>{isEditing ? "Edit Stock" : "Add Stock"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the stock details below."
              : "Fill in the details for the new stock."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <LocaleInput
            field="name"
            label="Name"
            languages={languages}
            defaultValue={stock?.name}
            translations={stock?.translations}
            required
            placeholder="Commercial International Bank"
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              name="symbol"
              placeholder="COMI"
              defaultValue={stock?.symbol}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="countryCode">Country Code</Label>
            <Input
              id="countryCode"
              name="countryCode"
              placeholder="EG"
              maxLength={3}
              defaultValue={stock?.countryCode}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="exchange">Exchange</Label>
            <Input
              id="exchange"
              name="exchange"
              placeholder="EGX"
              defaultValue={stock?.exchange}
              required
            />
          </div>

          <LocaleInput
            field="sector"
            label="Sector"
            languages={languages}
            defaultValue={stock?.sector}
            translations={stock?.translations}
            required
            placeholder="Financial Services"
          />

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={stock?.enabled ?? true}
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
