"use client"

import { useState } from "react"
import type { DataSource } from "@fin-ai/shared"
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
import { createDataSource, updateDataSource } from "./actions"
import { toast } from "sonner"

export function DataSourceForm({
  open,
  onOpenChange,
  dataSource,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataSource?: DataSource
}) {
  const isEditing = !!dataSource
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const countryCodes = (form.get("countryCodes") as string)
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)

    let config: Record<string, unknown> = {}
    try {
      const raw = form.get("config") as string
      if (raw) config = JSON.parse(raw)
    } catch {
      toast.error("Invalid JSON in config")
      setLoading(false)
      return
    }

    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      type: form.get("type") as DataSource["type"],
      urlTemplate: form.get("urlTemplate") as string,
      countryCodes,
      config,
      rateLimitMs: Number(form.get("rateLimitMs")) || 3000,
      maxRetries: Number(form.get("maxRetries")) || 3,
      enabled: form.get("enabled") === "on",
    }

    try {
      if (isEditing) {
        await updateDataSource(dataSource.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createDataSource(data as never)
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
          <SheetTitle>{isEditing ? "Edit Data Source" : "Add Data Source"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the data source configuration."
              : "Configure a new scraping or index list source."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={dataSource?.name} required placeholder="StockAnalysis.com" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={dataSource?.slug} required placeholder="stockanalysis" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue={dataSource?.type ?? "scraper"}
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="scraper">Scraper</option>
              <option value="index_list">Index List</option>
              <option value="etf_holdings">ETF Holdings</option>
              <option value="manual_csv">Manual CSV</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="urlTemplate">URL Template</Label>
            <Input
              id="urlTemplate"
              name="urlTemplate"
              defaultValue={dataSource?.urlTemplate}
              placeholder="https://example.com/{symbol}"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="countryCodes">Country Codes (comma-separated)</Label>
            <Input
              id="countryCodes"
              name="countryCodes"
              defaultValue={dataSource?.countryCodes.join(", ")}
              placeholder="EG, SA, MY"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rateLimitMs">Rate Limit (ms)</Label>
            <Input
              id="rateLimitMs"
              name="rateLimitMs"
              type="number"
              defaultValue={dataSource?.rateLimitMs ?? 3000}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="maxRetries">Max Retries</Label>
            <Input
              id="maxRetries"
              name="maxRetries"
              type="number"
              defaultValue={dataSource?.maxRetries ?? 3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="config">Config (JSON)</Label>
            <textarea
              id="config"
              name="config"
              rows={4}
              defaultValue={dataSource ? JSON.stringify(dataSource.config, null, 2) : "{}"}
              className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm font-mono shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch id="enabled" name="enabled" defaultChecked={dataSource?.enabled ?? true} />
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
