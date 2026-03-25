"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Prompt } from "@fin-ai/shared";

export async function listPrompts() {
  return api<Prompt[]>("/prompts");
}

export async function getPrompt(id: string) {
  return api<Prompt>(`/prompts/${id}`);
}

export async function createPrompt(
  data: Omit<Prompt, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Prompt>("/prompts", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/prompts");
  return result;
}

export async function updatePrompt(
  id: string,
  data: Partial<Omit<Prompt, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Prompt>(`/prompts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/prompts");
  return result;
}

export async function deletePrompt(id: string) {
  await api(`/prompts/${id}`, { method: "DELETE" });
  revalidatePath("/prompts");
}
