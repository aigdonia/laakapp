"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { LearningCard } from "@fin-ai/shared";

export async function listLearningCards() {
  return api<LearningCard[]>("/learning-cards");
}

export async function getLearningCard(id: string) {
  return api<LearningCard>(`/learning-cards/${id}`);
}

export async function createLearningCard(
  data: Omit<LearningCard, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<LearningCard>("/learning-cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/learning-cards");
  return result;
}

export async function updateLearningCard(
  id: string,
  data: Partial<Omit<LearningCard, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<LearningCard>(`/learning-cards/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/learning-cards");
  return result;
}

export async function deleteLearningCard(id: string) {
  await api(`/learning-cards/${id}`, { method: "DELETE" });
  revalidatePath("/learning-cards");
}

export async function reorderLearningCards(ids: string[]) {
  await api("/learning-cards/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/learning-cards");
}
