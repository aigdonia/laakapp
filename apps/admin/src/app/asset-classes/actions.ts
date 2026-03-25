"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { AssetClass } from "@fin-ai/shared";

export async function listAssetClasses() {
  return api<AssetClass[]>("/asset-classes");
}

export async function getAssetClass(id: string) {
  return api<AssetClass>(`/asset-classes/${id}`);
}

export async function createAssetClass(
  data: Omit<AssetClass, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<AssetClass>("/asset-classes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/asset-classes");
  return result;
}

export async function updateAssetClass(
  id: string,
  data: Partial<Omit<AssetClass, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<AssetClass>(`/asset-classes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/asset-classes");
  return result;
}

export async function deleteAssetClass(id: string) {
  await api(`/asset-classes/${id}`, { method: "DELETE" });
  revalidatePath("/asset-classes");
}

export async function reorderAssetClasses(ids: string[]) {
  await api("/asset-classes/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/asset-classes");
}
