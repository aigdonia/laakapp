"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Country } from "@fin-ai/shared";

export async function listCountries() {
  return api<Country[]>("/countries");
}

export async function getCountry(id: string) {
  return api<Country>(`/countries/${id}`);
}

export async function createCountry(
  data: Omit<Country, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Country>("/countries", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/countries");
  return result;
}

export async function updateCountry(
  id: string,
  data: Partial<Omit<Country, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Country>(`/countries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/countries");
  return result;
}

export async function deleteCountry(id: string) {
  await api(`/countries/${id}`, { method: "DELETE" });
  revalidatePath("/countries");
}
