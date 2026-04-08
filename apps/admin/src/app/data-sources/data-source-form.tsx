"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { DataSource, DataSourceParam } from "@fin-ai/shared"
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

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export function DataSourceForm({
  open,
  onOpenChange,
  dataSource,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataSource?: DataSource
}) {
  const router = useRouter()
  const isEditing = !!dataSource
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<DataSourceParam[]>(
    dataSource?.params ?? []
  )

  function addParam() {
    setParams([
      ...params,
      { key: "", label: "", type: "string", required: true },
    ])
  }

  function removeParam(index: number) {
    setParams(params.filter((_, i) => i !== index))
  }

  function updateParam(index: number, updates: Partial<DataSourceParam>) {
    setParams(
      params.map((p, i) =>
        i === index ? { ...p, ...updates } : p
      )
    )
  }

  function updateParamOptions(index: number, optionsStr: string) {
    try {
      const options = JSON.parse(optionsStr)
      updateParam(index, { options })
    } catch {
      // ignore parse errors while typing
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      urlTemplate: form.get("urlTemplate") as string,
      params,
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
      router.refresh()
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Data Source" : "Add Data Source"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the data source configuration."
              : "Register a new scraping script with its parameters."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={dataSource?.name} required placeholder="TradingView Market Prices" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={dataSource?.slug} required placeholder="tradingview-prices" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="urlTemplate">URL Template</Label>
            <Input
              id="urlTemplate"
              name="urlTemplate"
              defaultValue={dataSource?.urlTemplate}
              placeholder="https://scanner.tradingview.com/{{region}}/scan"
            />
            <p className="text-xs text-muted-foreground">
              Use {"{{paramKey}}"} for placeholders that match parameter keys.
            </p>
          </div>

          {/* Params Builder */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Parameters</Label>
              <Button type="button" variant="outline" size="sm" onClick={addParam}>
                + Add Param
              </Button>
            </div>

            {params.map((param, index) => (
              <div key={index} className="rounded-md border p-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="key"
                    value={param.key}
                    onChange={(e) => updateParam(index, { key: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Label"
                    value={param.label}
                    onChange={(e) => updateParam(index, { label: e.target.value })}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={param.type}
                    onChange={(e) =>
                      updateParam(index, {
                        type: e.target.value as DataSourceParam["type"],
                        options: e.target.value === "enum" ? {} : undefined,
                      })
                    }
                    className={selectClass + " flex-1"}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="enum">Enum</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParam(index, { required: e.target.checked })}
                    />
                    Required
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeParam(index)}
                  >
                    Remove
                  </Button>
                </div>
                {param.type === "enum" && (
                  <textarea
                    rows={3}
                    placeholder='{"Label": "value", "Another": "val2"}'
                    defaultValue={param.options ? JSON.stringify(param.options, null, 2) : "{}"}
                    onChange={(e) => updateParamOptions(index, e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-xs font-mono shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                )}
              </div>
            ))}

            {params.length === 0 && (
              <p className="text-sm text-muted-foreground">No parameters defined. Click &quot;+ Add Param&quot; to add.</p>
            )}
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
