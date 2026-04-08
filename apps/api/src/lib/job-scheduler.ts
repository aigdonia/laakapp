/**
 * Job Scheduler — checks scrape jobs with schedules and spawns executions when due.
 * Called from the CF Worker scheduled handler (every 5 minutes).
 */

import { eq, and, isNotNull, desc } from "drizzle-orm";
import type { Database } from "../db";
import { scrapeJobs, scrapeExecutions } from "../db/schema";
import { executeJob } from "./job-executor";

function isDue(schedule: string, lastCompletedAt: string | null): boolean {
  const now = Date.now();

  // Parse interval: "every 5m", "every 1h", "every 24h", "every 14d"
  const match = schedule.match(/^every\s+(\d+)\s*(m|h|d)$/i);
  if (!match) {
    // Unknown format — treat as daily
    if (!lastCompletedAt) return true;
    return now - new Date(lastCompletedAt).getTime() >= 86_400_000;
  }

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const ms =
    unit === "m"
      ? value * 60_000
      : unit === "h"
        ? value * 3_600_000
        : value * 86_400_000;

  if (!lastCompletedAt) return true;
  return now - new Date(lastCompletedAt).getTime() >= ms;
}

export async function processScheduledScrapeJobs(
  db: Database,
  bucket: R2Bucket
): Promise<void> {
  // Find enabled jobs with a schedule
  const scheduledJobs = await db
    .select()
    .from(scrapeJobs)
    .where(
      and(
        eq(scrapeJobs.enabled, true),
        isNotNull(scrapeJobs.schedule)
      )
    )
    .all();

  for (const job of scheduledJobs) {
    if (!job.schedule) continue;

    // Get last execution for this job
    const lastExec = await db
      .select()
      .from(scrapeExecutions)
      .where(eq(scrapeExecutions.jobId, job.id))
      .orderBy(desc(scrapeExecutions.createdAt))
      .limit(1)
      .get();

    // Skip if there's a pending or running execution
    if (lastExec && (lastExec.status === "pending" || lastExec.status === "running")) {
      continue;
    }

    if (!isDue(job.schedule, lastExec?.completedAt ?? null)) continue;

    console.log(
      `[scheduler] Job ${job.id} is due (schedule: ${job.schedule})`
    );

    try {
      await executeJob(job, "cron", db, bucket);
    } catch (error) {
      console.error(
        `[scheduler] Execution failed for job ${job.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }
}
