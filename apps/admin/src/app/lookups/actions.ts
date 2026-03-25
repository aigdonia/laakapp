"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Lookup } from "@fin-ai/shared";

export async function listLookups() {
  return api<Lookup[]>("/lookups");
}

export async function createLookup(
  data: Omit<Lookup, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Lookup>("/lookups", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/lookups");
  return result;
}

export async function updateLookup(
  id: string,
  data: Partial<Omit<Lookup, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Lookup>(`/lookups/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/lookups");
  return result;
}

export async function deleteLookup(id: string) {
  await api(`/lookups/${id}`, { method: "DELETE" });
  revalidatePath("/lookups");
}

export async function reorderLookups(ids: string[]) {
  await api("/lookups/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/lookups");
}
