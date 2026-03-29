"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { ScrapeJob, DataSource } from "@fin-ai/shared";

export async function listScrapeJobs() {
  return api<ScrapeJob[]>("/scrape-jobs");
}

export async function listDataSources() {
  return api<DataSource[]>("/data-sources");
}

export async function createScrapeJob(
  data: Pick<ScrapeJob, "dataSourceId" | "jobType" | "targetSymbols" | "createdBy">
) {
  const result = await api<ScrapeJob>("/scrape-jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/scrape-jobs");
  return result;
}

export async function cancelScrapeJob(id: string) {
  const result = await api<ScrapeJob>(`/scrape-jobs/${id}/cancel`, {
    method: "POST",
  });
  revalidatePath("/scrape-jobs");
  return result;
}

export async function deleteScrapeJob(id: string) {
  await api(`/scrape-jobs/${id}`, { method: "DELETE" });
  revalidatePath("/scrape-jobs");
}
