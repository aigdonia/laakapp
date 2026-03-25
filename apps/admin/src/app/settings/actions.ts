"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { AppSettings } from "@fin-ai/shared";

export async function getAppSettings() {
  return api<AppSettings>("/app-settings");
}

export async function updateAppSettings(
  data: Partial<Omit<AppSettings, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<AppSettings>("/app-settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/settings");
  return result;
}
