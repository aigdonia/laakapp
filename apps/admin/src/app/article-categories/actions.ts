"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { ArticleCategory } from "@fin-ai/shared";

export async function listArticleCategories() {
  return api<ArticleCategory[]>("/article-categories");
}

export async function getArticleCategory(id: string) {
  return api<ArticleCategory>(`/article-categories/${id}`);
}

export async function createArticleCategory(
  data: Partial<Omit<ArticleCategory, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<ArticleCategory>("/article-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/article-categories");
  return result;
}

export async function updateArticleCategory(
  id: string,
  data: Partial<Omit<ArticleCategory, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<ArticleCategory>(`/article-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/article-categories");
  return result;
}

export async function deleteArticleCategory(id: string) {
  await api(`/article-categories/${id}`, { method: "DELETE" });
  revalidatePath("/article-categories");
}

export async function reorderArticleCategories(ids: string[]) {
  await api("/article-categories/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/article-categories");
}
