"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { UiTranslation } from "@fin-ai/shared";

export async function listUiTranslations(namespace?: string) {
  const params = namespace ? `?namespace=${namespace}` : "";
  return api<UiTranslation[]>(`/ui-translations${params}`);
}

export async function createUiTranslation(
  data: Omit<UiTranslation, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<UiTranslation>("/ui-translations", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/translations");
  return result;
}

export async function updateUiTranslation(
  id: string,
  data: Partial<Omit<UiTranslation, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<UiTranslation>(`/ui-translations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/translations");
  return result;
}

export async function deleteUiTranslation(id: string) {
  await api(`/ui-translations/${id}`, { method: "DELETE" });
  revalidatePath("/translations");
}

export async function bulkUpsertTranslations(
  data: Array<{
    key: string;
    namespace: string;
    languageCode: string;
    value: string;
  }>
) {
  const result = await api<UiTranslation[]>("/ui-translations/bulk", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/translations");
  return result;
}
