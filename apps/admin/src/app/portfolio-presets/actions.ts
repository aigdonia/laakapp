"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { PortfolioPreset } from "@fin-ai/shared";

export async function listPortfolioPresets() {
  return api<PortfolioPreset[]>("/portfolio-presets");
}

export async function getPortfolioPreset(id: string) {
  return api<PortfolioPreset>(`/portfolio-presets/${id}`);
}

export async function createPortfolioPreset(
  data: Omit<PortfolioPreset, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<PortfolioPreset>("/portfolio-presets", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/portfolio-presets");
  return result;
}

export async function updatePortfolioPreset(
  id: string,
  data: Partial<Omit<PortfolioPreset, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<PortfolioPreset>(`/portfolio-presets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/portfolio-presets");
  return result;
}

export async function deletePortfolioPreset(id: string) {
  await api(`/portfolio-presets/${id}`, { method: "DELETE" });
  revalidatePath("/portfolio-presets");
}

export async function reorderPortfolioPresets(ids: string[]) {
  await api("/portfolio-presets/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/portfolio-presets");
}
