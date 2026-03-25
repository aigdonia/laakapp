"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { CreditPackage } from "@fin-ai/shared";

export async function listCreditPackages() {
  return api<CreditPackage[]>("/credit-packages");
}

export async function getCreditPackage(id: string) {
  return api<CreditPackage>(`/credit-packages/${id}`);
}

export async function createCreditPackage(
  data: Omit<CreditPackage, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<CreditPackage>("/credit-packages", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/credit-packages");
  return result;
}

export async function updateCreditPackage(
  id: string,
  data: Partial<Omit<CreditPackage, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<CreditPackage>(`/credit-packages/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/credit-packages");
  return result;
}

export async function deleteCreditPackage(id: string) {
  await api(`/credit-packages/${id}`, { method: "DELETE" });
  revalidatePath("/credit-packages");
}
