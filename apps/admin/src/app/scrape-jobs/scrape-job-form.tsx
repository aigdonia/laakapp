"use client"

import { useState } from "react"
import type { DataSource } from "@fin-ai/shared"
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
import { createScrapeJob } from "./actions"
import { toast } from "sonner"

export function ScrapeJobForm({
  open,
  onOpenChange,
  dataSources,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataSources: DataSource[]
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const symbolsRaw = form.get("targetSymbols") as string
    const targetSymbols = symbolsRaw
      ? symbolsRaw.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean)
      : null

    try {
      await createScrapeJob({
        dataSourceId: form.get("dataSourceId") as string,
        jobType: form.get("jobType") as "full_refresh" | "incremental" | "single_stock",
        targetSymbols,
        createdBy: "admin",
      })
      toast.success("Scrape job created")
      onOpenChange(false)
    } catch {
      toast.error("Failed to create job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Scrape Job</SheetTitle>
          <SheetDescription>
            Create a new scraping job. Run the scrape runner script to process it.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dataSourceId">Data Source</Label>
            <select
              id="dataSourceId"
              name="dataSourceId"
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="">Select source</option>
              {dataSources.filter((s) => s.enabled).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type.replace(/_/g, " ")})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="jobType">Job Type</Label>
            <select
              id="jobType"
              name="jobType"
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="full_refresh">Full Refresh</option>
              <option value="incremental">Incremental</option>
              <option value="single_stock">Single Stock</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="targetSymbols">Target Symbols (optional, comma-separated)</Label>
            <Input
              id="targetSymbols"
              name="targetSymbols"
              placeholder="COMI, 2222, MAYBANK"
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
