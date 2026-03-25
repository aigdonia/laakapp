"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Affiliate } from "@fin-ai/shared";

export async function listAffiliates() {
  return api<Affiliate[]>("/affiliates");
}

export async function getAffiliate(id: string) {
  return api<Affiliate>(`/affiliates/${id}`);
}

export async function createAffiliate(
  data: Omit<Affiliate, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Affiliate>("/affiliates", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/affiliates");
  return result;
}

export async function updateAffiliate(
  id: string,
  data: Partial<Omit<Affiliate, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Affiliate>(`/affiliates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/affiliates");
  return result;
}

export async function deleteAffiliate(id: string) {
  await api(`/affiliates/${id}`, { method: "DELETE" });
  revalidatePath("/affiliates");
}
