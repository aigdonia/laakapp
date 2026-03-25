"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Stock } from "@fin-ai/shared";

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
