"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { Article } from "@fin-ai/shared";

export async function listArticles() {
  return api<Article[]>("/articles");
}

export async function getArticle(id: string) {
  return api<Article>(`/articles/${id}`);
}

export async function createArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<Article>("/articles", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/articles");
  return result;
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Article>(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/articles");
  return result;
}

export async function deleteArticle(id: string) {
  await api(`/articles/${id}`, { method: "DELETE" });
  revalidatePath("/articles");
}
