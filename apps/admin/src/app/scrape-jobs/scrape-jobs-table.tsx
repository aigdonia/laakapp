"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ScrapeJobWithLastRun, ScrapeExecution, DataSource } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  IconPlayerPlay,
  IconFileText,
  IconPlayerPause,
  IconPlayerPlayFilled,
  IconPlus,
  IconTrash,
  IconRefresh,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react"
import {
  toggleScrapeJob,
  deleteScrapeJob,
  runScrapeJob,
  fetchExecutionLogs,
  listExecutions,
} from "./actions"
import { ScrapeJobForm } from "./scrape-job-form"
import { toast } from "sonner"

// ─── Helpers ──────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function duration(start: string | null, end: string | null): string {
  if (!start || !end) return "—"
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function jobStatus(
  job: ScrapeJobWithLastRun
): { label: string; variant: "success" | "destructive" | "secondary" | "outline" } {
  if (job.schedule && job.enabled) return { label: "Active", variant: "success" }
  if (job.schedule && !job.enabled) return { label: "Paused", variant: "secondary" }
  if (!job.lastExecution) return { label: "New", variant: "outline" }
  if (job.lastExecution.status === "completed") return { label: "Done", variant: "success" }
  if (job.lastExecution.status === "failed") return { label: "Failed", variant: "destructive" }
  if (job.lastExecution.status === "running") return { label: "Running", variant: "outline" }
  return { label: "Pending", variant: "secondary" }
}

// ─── Job Cell ─────────────────────────────────────────────────

function JobCell({ params }: { params: Record<string, string | number | null> }) {
  const exchange = params.exchange ?? params.region
  const rest = Object.entries(params).filter(
    ([k, v]) => k !== "exchange" && k !== "region" && v != null
  )

  return (
    <div>
      {exchange != null && (
        <span className="font-medium">{capitalize(String(exchange))}</span>
      )}
      {rest.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {rest.map(([k, v]) => (
            <Badge key={k} variant="outline" className="text-[10px] font-normal py-0">
              {k}: {String(v)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Execution Row ────────────────────────────────────────────

function ExecutionRow({
  exec,
  index,
  onViewLogs,
}: {
  exec: ScrapeExecution
  index: number
  onViewLogs: (exec: ScrapeExecution) => void
}) {
  const p = exec.progress
  const statusVariant: Record<string, "success" | "destructive" | "secondary" | "outline"> = {
    completed: "success",
    failed: "destructive",
    running: "outline",
    pending: "secondary",
  }

  return (
    <tr className="bg-muted/30 text-xs">
      <td className="pl-12 pr-4 py-2 text-muted-foreground">#{index}</td>
      <td className="px-4 py-2">
        <Badge variant={statusVariant[exec.status] ?? "secondary"} className="text-[10px]">
          {exec.status}
        </Badge>
      </td>
      <td className="px-4 py-2 text-muted-foreground tabular-nums">
        {p.completed}/{p.total}
        {p.failed > 0 && <span className="text-destructive ml-1">({p.failed} err)</span>}
      </td>
      <td className="px-4 py-2 text-muted-foreground" title={exec.startedAt ? new Date(exec.startedAt).toLocaleString() : ""}>
        {exec.startedAt ? timeAgo(exec.startedAt) : "—"}
      </td>
      <td className="px-4 py-2 text-muted-foreground tabular-nums">
        {duration(exec.startedAt, exec.completedAt)}
      </td>
      <td className="px-4 py-2 text-muted-foreground capitalize">{exec.trigger}</td>
      <td className="px-4 py-2 text-end">
        {exec.logKey && (
          <Button variant="ghost" size="icon-xs" title="View Logs" onClick={() => onViewLogs(exec)}>
            <IconFileText className="size-3.5" />
          </Button>
        )}
      </td>
    </tr>
  )
}

// ─── Main Table ───────────────────────────────────────────────

export function ScrapeJobsTable({
  jobs,
  dataSources,
}: {
  jobs: ScrapeJobWithLastRun[]
  dataSources: DataSource[]
}) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)
  const [executions, setExecutions] = useState<ScrapeExecution[]>([])
  const [logsExec, setLogsExec] = useState<ScrapeExecution | null>(null)
  const [logs, setLogs] = useState<Array<{ ts: string; level: string; msg: string }>>([])

  async function handleExpand(jobId: string) {
    if (expandedJobId === jobId) {
      setExpandedJobId(null)
      return
    }
    try {
      const execs = await listExecutions(jobId)
      setExecutions(execs)
      setExpandedJobId(jobId)
    } catch {
      toast.error("Failed to load executions")
    }
  }

  async function handleRun(jobId: string) {
    try {
      toast.info("Running...")
      await runScrapeJob(jobId)
      router.refresh()
      toast.success("Completed")
    } catch {
      router.refresh()
      toast.error("Failed")
    }
  }

  async function handleToggle(jobId: string) {
    try {
      await toggleScrapeJob(jobId)
      router.refresh()
    } catch {
      toast.error("Failed to toggle")
    }
  }

  async function handleDelete(jobId: string) {
    try {
      await deleteScrapeJob(jobId)
      router.refresh()
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  async function handleViewLogs(exec: ScrapeExecution) {
    try {
      const result = await fetchExecutionLogs(exec.id)
      setLogs(result.logs)
      setLogsExec(exec)
    } catch {
      toast.error("Failed to fetch logs")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          New Job
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium w-36">Job</th>
              <th className="px-4 py-3 text-start font-medium">Source</th>
              <th className="px-4 py-3 text-start font-medium">Schedule</th>
              <th className="px-4 py-3 text-start font-medium">Last Run</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No scrape jobs yet. Create a new job to start.
                </td>
              </tr>
            )}
            {jobs.map((job) => {
              const status = jobStatus(job)
              const isExpanded = expandedJobId === job.id
              const lastRun = job.lastExecution

              return (
                <>
                  <tr key={job.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-start"
                        onClick={() => handleExpand(job.id)}
                      >
                        {isExpanded
                          ? <IconChevronDown className="size-3.5 text-muted-foreground" />
                          : <IconChevronRight className="size-3.5 text-muted-foreground" />}
                        <JobCell params={job.params} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {job.dataSourceName ?? "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {job.schedule
                        ? capitalize(job.schedule)
                        : <span className="text-xs">One-time</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground" title={lastRun?.completedAt ? new Date(lastRun.completedAt).toLocaleString() : ""}>
                      {lastRun?.completedAt ? timeAgo(lastRun.completedAt) : "Never"}
                      {lastRun && (
                        <span className="text-xs ml-1 tabular-nums">
                          ({lastRun.progress.completed}/{lastRun.progress.total})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-xs" title="Run Now" onClick={() => handleRun(job.id)}>
                          <IconPlayerPlay className="size-4" />
                        </Button>
                        {job.schedule && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title={job.enabled ? "Pause" : "Resume"}
                            onClick={() => handleToggle(job.id)}
                          >
                            {job.enabled
                              ? <IconPlayerPause className="size-4" />
                              : <IconPlayerPlayFilled className="size-4" />}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          title="Delete"
                          className="text-destructive"
                          onClick={() => handleDelete(job.id)}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <>
                      <tr className="bg-muted/20">
                        <td colSpan={6} className="px-0 py-0">
                          <table className="w-full">
                            <thead>
                              <tr className="text-[10px] uppercase text-muted-foreground tracking-wider">
                                <th className="pl-12 pr-4 py-1.5 text-start font-medium">#</th>
                                <th className="px-4 py-1.5 text-start font-medium">Status</th>
                                <th className="px-4 py-1.5 text-start font-medium">Progress</th>
                                <th className="px-4 py-1.5 text-start font-medium">Started</th>
                                <th className="px-4 py-1.5 text-start font-medium">Duration</th>
                                <th className="px-4 py-1.5 text-start font-medium">Trigger</th>
                                <th className="px-4 py-1.5 text-end font-medium">Logs</th>
                              </tr>
                            </thead>
                            <tbody>
                              {executions.length === 0 && (
                                <tr>
                                  <td colSpan={7} className="pl-12 py-3 text-xs text-muted-foreground">
                                    No executions yet.
                                  </td>
                                </tr>
                              )}
                              {executions.map((exec, i) => (
                                <ExecutionRow
                                  key={exec.id}
                                  exec={exec}
                                  index={executions.length - i}
                                  onViewLogs={handleViewLogs}
                                />
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      <ScrapeJobForm
        open={showCreate}
        onOpenChange={setShowCreate}
        dataSources={dataSources}
      />

      {/* Logs Sheet */}
      <Sheet open={!!logsExec} onOpenChange={(open) => { if (!open) setLogsExec(null) }}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Execution Logs</SheetTitle>
            <SheetDescription>
              {logsExec?.id.slice(0, 8)}... — {logsExec?.status}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 overflow-auto max-h-[calc(100vh-120px)]">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No logs available.</p>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {logs.map((entry, i) => (
                  <div
                    key={i}
                    className={`py-1 ${
                      entry.level === "error"
                        ? "text-destructive"
                        : entry.level === "warn"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    <span className="opacity-50">
                      {new Date(entry.ts).toLocaleTimeString()}
                    </span>{" "}
                    <span className="uppercase font-semibold">[{entry.level}]</span>{" "}
                    {entry.msg}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
