"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { EventType } from "@fin-ai/shared";

export async function listEventTypes() {
  return api<EventType[]>("/event-types");
}

export async function createEventType(data: {
  slug: string;
  label: string;
  description: string;
  enabled: boolean;
}) {
  const result = await api<EventType>("/event-types", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/event-types");
  return result;
}

export async function updateEventType(
  id: string,
  data: Partial<Omit<EventType, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<EventType>(`/event-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/event-types");
  return result;
}

export async function deleteEventType(id: string) {
  await api(`/event-types/${id}`, { method: "DELETE" });
  revalidatePath("/event-types");
}
