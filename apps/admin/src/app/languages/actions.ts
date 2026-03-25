"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Language } from "@fin-ai/shared";

export async function listLanguages() {
  return api<Language[]>("/languages");
}

export async function getLanguage(id: string) {
  return api<Language>(`/languages/${id}`);
}

export async function createLanguage(
  data: Omit<Language, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Language>("/languages", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/languages");
  return result;
}

export async function updateLanguage(
  id: string,
  data: Partial<Omit<Language, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Language>(`/languages/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/languages");
  return result;
}

export async function deleteLanguage(id: string) {
  await api(`/languages/${id}`, { method: "DELETE" });
  revalidatePath("/languages");
}
