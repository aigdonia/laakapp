"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { AiFeature, Prompt } from "@fin-ai/shared";

export async function listAiFeatures() {
  return api<AiFeature[]>("/ai-features");
}

export async function listPrompts() {
  return api<Prompt[]>("/prompts");
}

export async function createAiFeature(data: {
  slug: string;
  name: string;
  description: string;
  creditCost: number;
  freeRefresh: boolean;
  promptSlug: string;
  enabled: boolean;
}) {
  const result = await api<AiFeature>("/ai-features", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/ai-features");
  return result;
}

export async function updateAiFeature(
  id: string,
  data: Partial<Omit<AiFeature, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<AiFeature>(`/ai-features/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/ai-features");
  return result;
}

export async function deleteAiFeature(id: string) {
  await api(`/ai-features/${id}`, { method: "DELETE" });
  revalidatePath("/ai-features");
}
