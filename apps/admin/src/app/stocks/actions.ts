"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Stock, Lookup, ScreeningRule, StockCompliance } from "@fin-ai/shared";

// --- Lookups ---
export async function listExchangeLookups() {
  const lookups = await api<Lookup[]>("/lookups");
  return lookups.filter((l) => l.category === "exchanges" && l.enabled);
}

export async function listSectorLookups() {
  const lookups = await api<Lookup[]>("/lookups");
  return lookups.filter((l) => l.category === "sectors" && l.enabled);
}

// --- Stocks (paginated) ---
export async function listStocksPaginated(params: {
  page?: number;
  limit?: number;
  search?: string;
  countryCode?: string;
  exchange?: string;
  sector?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page ?? 1));
  qs.set("limit", String(params.limit ?? 20));
  if (params.search) qs.set("search", params.search);
  if (params.countryCode) qs.set("countryCode", params.countryCode);
  if (params.exchange) qs.set("exchange", params.exchange);
  if (params.sector) qs.set("sector", params.sector);

  return api<{
    data: Stock[];
    total: number;
    page: number;
    limit: number;
  }>(`/stocks?${qs.toString()}`);
}

// --- Stocks CRUD (keep existing) ---
export async function listStocks() {
  return api<Stock[]>("/stocks");
}

export async function getStock(id: string) {
  return api<Stock>(`/stocks/${id}`);
}

export async function createStock(
  data: Omit<Stock, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Stock>("/stocks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/stocks");
  return result;
}

export async function updateStock(
  id: string,
  data: Partial<Omit<Stock, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Stock>(`/stocks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/stocks");
  return result;
}

export async function deleteStock(id: string) {
  await api(`/stocks/${id}`, { method: "DELETE" });
  revalidatePath("/stocks");
}

export async function bulkUpsertStocks(
  data: Array<{
    symbol: string;
    name: string;
    countryCode: string;
    exchange: string;
    sector?: string;
    lastPrice?: number | null;
    enabled?: boolean;
  }>
) {
  const result = await api<{
    created: number;
    updated: number;
    errors: string[];
  }>("/stocks/bulk", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/stocks");
  return result;
}

// --- Screening Rules ---
export async function listScreeningRules() {
  return api<ScreeningRule[]>("/screening-rules");
}

// --- Compliance ---
export async function listComplianceForStocks(stockIds: string[]) {
  if (stockIds.length === 0) return [];
  return api<StockCompliance[]>(
    `/stock-compliance?stockId=${stockIds.join(",")}`
  );
}

export async function updateComplianceStatus(
  id: string,
  data: { status: string; source?: string; notes?: string }
) {
  const result = await api<StockCompliance>(`/stock-compliance/${id}`, {
    method: "PUT",
    body: JSON.stringify({ ...data, source: "manual_override" }),
  });
  revalidatePath("/stocks");
  return result;
}

export async function createComplianceOverride(data: {
  stockId: string;
  screeningRuleId: string;
  status: string;
  layer: string;
  source: string;
  validFrom: string;
  notes?: string;
}) {
  const result = await api<StockCompliance>("/stock-compliance", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/stocks");
  return result;
}

export async function runScreening(stockIds?: string[]) {
  return api<{ screened: number; stocks: number; rules: number }>(
    "/stock-compliance/run-screening",
    {
      method: "POST",
      body: JSON.stringify(stockIds ? { stockIds } : {}),
    }
  );
}
