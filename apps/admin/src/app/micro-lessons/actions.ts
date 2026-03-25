"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { MicroLesson } from "@fin-ai/shared";

export async function listMicroLessons() {
  return api<MicroLesson[]>("/micro-lessons");
}

export async function getMicroLesson(id: string) {
  return api<MicroLesson>(`/micro-lessons/${id}`);
}

export async function createMicroLesson(
  data: Omit<MicroLesson, "id" | "createdAt" | "updatedAt">
) {
  const result = await api<MicroLesson>("/micro-lessons", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/micro-lessons");
  return result;
}

export async function updateMicroLesson(
  id: string,
  data: Partial<Omit<MicroLesson, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<MicroLesson>(`/micro-lessons/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/micro-lessons");
  return result;
}

export async function deleteMicroLesson(id: string) {
  await api(`/micro-lessons/${id}`, { method: "DELETE" });
  revalidatePath("/micro-lessons");
}

export async function reorderMicroLessons(ids: string[]) {
  await api("/micro-lessons/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/micro-lessons");
}
