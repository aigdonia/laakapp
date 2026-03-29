"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { DataSource } from "@fin-ai/shared";

export async function listDataSources() {
  return api<DataSource[]>("/data-sources");
}

export async function createDataSource(
  data: Omit<DataSource, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<DataSource>("/data-sources", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/data-sources");
  return result;
}

export async function updateDataSource(
  id: string,
  data: Partial<DataSource>
) {
  const result = await api<DataSource>(`/data-sources/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/data-sources");
  return result;
}

export async function deleteDataSource(id: string) {
  await api(`/data-sources/${id}`, { method: "DELETE" });
  revalidatePath("/data-sources");
}
