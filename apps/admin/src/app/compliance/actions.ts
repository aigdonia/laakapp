"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { StockCompliance, Stock, ScreeningRule } from "@fin-ai/shared";

export async function listCompliance(params?: {
  stockId?: string;
  screeningRuleId?: string;
  status?: string;
  countryCode?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.stockId) searchParams.set("stockId", params.stockId);
  if (params?.screeningRuleId)
    searchParams.set("screeningRuleId", params.screeningRuleId);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.countryCode)
    searchParams.set("countryCode", params.countryCode);

  const qs = searchParams.toString();
  return api<StockCompliance[]>(
    `/stock-compliance${qs ? `?${qs}` : ""}`
  );
}

export async function listStocks() {
  return api<Stock[]>("/stocks");
}

export async function listScreeningRules() {
  return api<ScreeningRule[]>("/screening-rules");
}

export async function createCompliance(
  data: Omit<StockCompliance, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<StockCompliance>("/stock-compliance", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/compliance");
  return result;
}

export async function updateCompliance(
  id: string,
  data: Partial<StockCompliance>
) {
  const result = await api<StockCompliance>(`/stock-compliance/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/compliance");
  return result;
}

export async function deleteCompliance(id: string) {
  await api(`/stock-compliance/${id}`, { method: "DELETE" });
  revalidatePath("/compliance");
}

export async function runScreening(params?: {
  stockIds?: string[];
  screeningRuleId?: string;
}) {
  const result = await api<{
    screened: number;
    stocks: number;
    rules: number;
  }>("/stock-compliance/run-screening", {
    method: "POST",
    body: JSON.stringify(params ?? {}),
  });
  revalidatePath("/compliance");
  return result;
}
