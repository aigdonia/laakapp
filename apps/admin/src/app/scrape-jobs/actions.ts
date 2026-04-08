"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { ScrapeJob, ScrapeExecution, ScrapeJobWithLastRun, DataSource } from "@fin-ai/shared";

export async function listScrapeJobs() {
  return api<ScrapeJobWithLastRun[]>("/scrape-jobs");
}

export async function getScrapeJob(id: string) {
  return api<ScrapeJob & { executions: ScrapeExecution[] }>(`/scrape-jobs/${id}`);
}

export async function listDataSources() {
  return api<DataSource[]>("/data-sources");
}

export async function createScrapeJob(
  data: Pick<ScrapeJob, "dataSourceId" | "params"> & { schedule?: string | null }
) {
  const result = await api<ScrapeJob>("/scrape-jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/scrape-jobs");
  return result;
}

export async function updateScrapeJob(
  id: string,
  data: Partial<Pick<ScrapeJob, "params" | "schedule" | "enabled">>
) {
  const result = await api<ScrapeJob>(`/scrape-jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/scrape-jobs");
  return result;
}

export async function toggleScrapeJob(id: string) {
  const result = await api<ScrapeJob>(`/scrape-jobs/${id}/toggle`, {
    method: "POST",
  });
  revalidatePath("/scrape-jobs");
  return result;
}

export async function runScrapeJob(id: string) {
  const result = await api<ScrapeExecution>(`/scrape-jobs/${id}/run`, {
    method: "POST",
  });
  revalidatePath("/scrape-jobs");
  return result;
}

export async function fetchExecutionLogs(executionId: string) {
  return api<{ logs: Array<{ ts: string; level: string; msg: string }> }>(
    `/scrape-executions/${executionId}/logs`
  );
}

export async function listExecutions(jobId: string) {
  return api<ScrapeExecution[]>(`/scrape-executions?jobId=${jobId}`);
}

export async function deleteScrapeJob(id: string) {
  await api(`/scrape-jobs/${id}`, { method: "DELETE" });
  revalidatePath("/scrape-jobs");
}

export async function deleteExecution(id: string) {
  await api(`/scrape-executions/${id}`, { method: "DELETE" });
  revalidatePath("/scrape-jobs");
}
