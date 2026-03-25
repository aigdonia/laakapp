"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { UiTranslation } from "@fin-ai/shared";
import { appendFileSync } from "fs";

function log(...args: unknown[]) {
  const line = `[${new Date().toISOString()}] ${args.map(String).join(" ")}\n`;
  try { appendFileSync("/tmp/admin-translations.log", line); } catch {}
  console.log(...args);
}

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
): Promise<{ data?: UiTranslation[]; error?: string }> {
  const apiUrl = process.env.API_URL || "http://localhost:12003";
  const url = `${apiUrl}/ui-translations/bulk`;

  log("[bulkUpsert] POST", url, JSON.stringify(data));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const text = await res.text();
    log("[bulkUpsert] response", res.status, text);

    if (!res.ok) {
      return { error: `API ${res.status}: ${text}` };
    }

    const result = JSON.parse(text) as UiTranslation[];
    revalidatePath("/translations");
    return { data: result };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    log("[bulkUpsert] exception", message);
    return { error: message };
  }
}
