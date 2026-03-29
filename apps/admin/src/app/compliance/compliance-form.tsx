"use client"

import { useState } from "react"
import type { StockCompliance, Stock, ScreeningRule } from "@fin-ai/shared"
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
import { createCompliance, updateCompliance } from "./actions"
import { toast } from "sonner"

export function ComplianceForm({
  open,
  onOpenChange,
  item,
  stocks,
  rules,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: StockCompliance
  stocks: Stock[]
  rules: ScreeningRule[]
}) {
  const isEditing = !!item
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      stockId: form.get("stockId") as string,
      screeningRuleId: form.get("screeningRuleId") as string,
      status: form.get("status") as StockCompliance["status"],
      layer: "manual" as const,
      source: "manual_override" as const,
      notes: form.get("notes") as string,
      validFrom: form.get("validFrom") as string,
      validUntil: (form.get("validUntil") as string) || null,
    }

    try {
      if (isEditing) {
        await updateCompliance(item.id, data)
        toast.success("Updated compliance record")
      } else {
        await createCompliance(data as never)
        toast.success("Created compliance override")
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
          <SheetTitle>{isEditing ? "Edit Compliance" : "Manual Override"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the compliance status."
              : "Manually set the compliance status for a stock."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="stockId">Stock</Label>
            <select
              id="stockId"
              name="stockId"
              defaultValue={item?.stockId}
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="">Select stock</option>
              {stocks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="screeningRuleId">Screening Rule</Label>
            <select
              id="screeningRuleId"
              name="screeningRuleId"
              defaultValue={item?.screeningRuleId}
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="">Select rule</option>
              {rules.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={item?.status ?? "compliant"}
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="compliant">Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
              <option value="doubtful">Doubtful</option>
              <option value="not_screened">Not Screened</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="validFrom">Valid From</Label>
            <Input
              id="validFrom"
              name="validFrom"
              type="date"
              defaultValue={item?.validFrom ?? new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="validUntil">Valid Until (optional)</Label>
            <Input
              id="validUntil"
              name="validUntil"
              type="date"
              defaultValue={item?.validUntil ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Reason for override..."
              defaultValue={item?.notes ?? ""}
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
