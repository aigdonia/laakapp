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
import { createScrapeJob, runScrapeJob } from "./actions"
import { toast } from "sonner"

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

function ParamField({ param }: { param: DataSourceParam }) {
  if (param.type === "enum" && param.options) {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={param.key}>{param.label}</Label>
        <select
          id={param.key}
          name={param.key}
          required={param.required}
          className={selectClass}
        >
          {!param.required && <option value="">-- none --</option>}
          {Object.entries(param.options).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={param.key}>{param.label}</Label>
      <Input
        id={param.key}
        name={param.key}
        type={param.type === "number" ? "number" : "text"}
        required={param.required}
        placeholder={param.label}
      />
    </div>
  )
}

const SCHEDULE_PRESETS = [
  { label: "Every 6 hours", value: "every 6h" },
  { label: "Every 12 hours", value: "every 12h" },
  { label: "Every 24 hours", value: "every 24h" },
  { label: "Every 3 days", value: "every 3d" },
  { label: "Every 7 days", value: "every 7d" },
  { label: "Every 14 days", value: "every 14d" },
]

export function ScrapeJobForm({
  open,
  onOpenChange,
  dataSources,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dataSources: DataSource[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)

  const selectedSource = dataSources.find((s) => s.id === selectedSourceId)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, andRun: boolean) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const source = dataSources.find((s) => s.id === form.get("dataSourceId"))
    if (!source) {
      toast.error("Select a data source")
      setLoading(false)
      return
    }

    const params: Record<string, string | number | null> = {}
    for (const param of source.params) {
      const raw = form.get(param.key) as string
      if (!raw && param.required) {
        toast.error(`${param.label} is required`)
        setLoading(false)
        return
      }
      if (!raw) continue
      params[param.key] = param.type === "number" ? Number(raw) : raw
    }

    const schedule = isScheduled ? (form.get("schedule") as string) || null : null

    try {
      const job = await createScrapeJob({
        dataSourceId: source.id,
        params,
        schedule,
      })

      if (andRun) {
        toast.info("Running job...")
        await runScrapeJob(job.id)
        toast.success("Job completed")
      } else {
        toast.success("Job created")
      }

      router.refresh()
      onOpenChange(false)
    } catch {
      toast.error("Failed to create/run job")
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
            Select a data source, configure parameters, and optionally set a schedule.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
            handleSubmit(e, submitter?.value === "run")
          }}
          className="flex flex-col gap-4 px-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="dataSourceId">Data Source</Label>
            <select
              id="dataSourceId"
              name="dataSourceId"
              required
              value={selectedSourceId}
              onChange={(e) => setSelectedSourceId(e.target.value)}
              className={selectClass}
            >
              <option value="">Select source</option>
              {dataSources.filter((s) => s.enabled).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {selectedSource?.params.map((param) => (
            <ParamField key={param.key} param={param} />
          ))}

          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label htmlFor="isScheduled" className="cursor-pointer">Recurring schedule</Label>
            <Switch
              id="isScheduled"
              checked={isScheduled}
              onCheckedChange={setIsScheduled}
            />
          </div>

          {isScheduled && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule">Interval</Label>
              <select
                id="schedule"
                name="schedule"
                required
                className={selectClass}
              >
                {SCHEDULE_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <SheetFooter className="flex gap-2">
            <Button type="submit" name="action" value="create" variant="outline" disabled={loading}>
              {loading ? "Working..." : "Create"}
            </Button>
            <Button type="submit" name="action" value="run" disabled={loading}>
              {loading ? "Working..." : "Create & Run"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
