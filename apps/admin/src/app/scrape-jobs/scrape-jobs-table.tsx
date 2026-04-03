"use client"

import { useState } from "react"
import type { ScrapeJob, DataSource } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPlayerStop, IconPlus, IconTrash } from "@tabler/icons-react"
import { cancelScrapeJob, deleteScrapeJob } from "./actions"
import { ScrapeJobForm } from "./scrape-job-form"
import { toast } from "sonner"

const STATUS_VARIANT: Record<string, "success" | "destructive" | "secondary" | "outline"> = {
  completed: "success",
  failed: "destructive",
  running: "outline",
  pending: "secondary",
}

export function ScrapeJobsTable({
  jobs,
  dataSources,
}: {
  jobs: ScrapeJob[]
  dataSources: DataSource[]
}) {
  const [showCreate, setShowCreate] = useState(false)
  const sourceById = Object.fromEntries(dataSources.map((s) => [s.id, s]))

  async function handleCancel(job: ScrapeJob) {
    try {
      await cancelScrapeJob(job.id)
      toast.success("Job cancelled")
    } catch {
      toast.error("Failed to cancel job")
    }
  }

  async function handleDelete(job: ScrapeJob) {
    try {
      await deleteScrapeJob(job.id)
      toast.success("Job deleted")
    } catch {
      toast.error("Failed to delete job")
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
              <th className="px-4 py-3 text-start font-medium">Data Source</th>
              <th className="px-4 py-3 text-start font-medium">Type</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-start font-medium">Progress</th>
              <th className="px-4 py-3 text-start font-medium">Created</th>
              <th className="px-4 py-3 text-start font-medium">Completed</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No scrape jobs yet. Create a new job to start.
                </td>
              </tr>
            )}
            {jobs.map((job) => {
              const source = sourceById[job.dataSourceId]
              const p = job.progress
              return (
                <tr key={job.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">
                    {source?.name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {job.jobType.replace(/_/g, " ")}
                    {job.jobType === "price_update" && job.targetSymbols?.length ? (
                      <span className="ml-1 text-xs text-foreground">
                        ({job.targetSymbols.join(", ")})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[job.status] ?? "secondary"}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">
                    {p.completed}/{p.total}
                    {p.failed > 0 && (
                      <span className="text-destructive ml-1">({p.failed} failed)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {job.completedAt
                      ? new Date(job.completedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" />}
                      >
                        <IconDots className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(job.status === "pending" || job.status === "running") && (
                          <DropdownMenuItem onClick={() => handleCancel(job)}>
                            <IconPlayerStop />
                            Cancel
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(job)}
                        >
                          <IconTrash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
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
    </>
  )
}
