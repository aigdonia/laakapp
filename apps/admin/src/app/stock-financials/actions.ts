"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { StockFinancial, Stock } from "@fin-ai/shared";

export async function listStockFinancials() {
  return api<StockFinancial[]>("/stock-financials");
}

export async function listStocks() {
  return api<Stock[]>("/stocks");
}

export async function deleteStockFinancial(id: string) {
  await api(`/stock-financials/${id}`, { method: "DELETE" });
  revalidatePath("/stock-financials");
}
