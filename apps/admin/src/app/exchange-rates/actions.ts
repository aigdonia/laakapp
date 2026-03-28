"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { AppSettings, ExchangeRate, Lookup } from "@fin-ai/shared";

export async function listExchangeRates() {
  return api<ExchangeRate[]>("/exchange-rates");
}

export async function getAppSettings() {
  return api<AppSettings>("/app-settings");
}

export async function listCurrencyLookups() {
  const lookups = await api<Lookup[]>("/lookups");
  return lookups.filter((l) => l.category === "currencies" && l.enabled);
}

export async function createExchangeRate(
  data: Omit<ExchangeRate, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<ExchangeRate>("/exchange-rates", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/exchange-rates");
  return result;
}

export async function updateExchangeRate(
  id: string,
  data: Partial<Omit<ExchangeRate, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<ExchangeRate>(`/exchange-rates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/exchange-rates");
  return result;
}

export async function deleteExchangeRate(id: string) {
  await api(`/exchange-rates/${id}`, { method: "DELETE" });
  revalidatePath("/exchange-rates");
}
