"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { ScreeningRule } from "@fin-ai/shared";

export async function listScreeningRules() {
  return api<ScreeningRule[]>("/screening-rules");
}

export async function getScreeningRule(id: string) {
  return api<ScreeningRule>(`/screening-rules/${id}`);
}

export async function createScreeningRule(
  data: Omit<ScreeningRule, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<ScreeningRule>("/screening-rules", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/screening-rules");
  return result;
}

export async function updateScreeningRule(
  id: string,
  data: Partial<Omit<ScreeningRule, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<ScreeningRule>(`/screening-rules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/screening-rules");
  return result;
}

export async function deleteScreeningRule(id: string) {
  await api(`/screening-rules/${id}`, { method: "DELETE" });
  revalidatePath("/screening-rules");
}
