"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { NotificationWithStats, Notification } from "@fin-ai/shared";

export async function listNotifications() {
  return api<NotificationWithStats[]>("/notifications");
}

export async function getNotification(id: string) {
  return api<Notification>(`/notifications/${id}`);
}

export async function createNotification(data: {
  title: string;
  body: string;
  category: "marketing" | "content" | "onboarding";
  deepLink?: string;
  target?: "all" | "ios" | "android";
  scheduledAt?: string;
}) {
  const result = await api<Notification>("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/notifications");
  return result;
}

export async function updateNotification(
  id: string,
  data: Partial<Omit<Notification, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<Notification>(`/notifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/notifications");
  return result;
}

export async function deleteNotification(id: string) {
  await api(`/notifications/${id}`, { method: "DELETE" });
  revalidatePath("/notifications");
}

export async function sendNotification(id: string) {
  const result = await api<{ sent: number; errors: number; total: number }>(
    `/notifications/${id}/send`,
    { method: "POST" }
  );
  revalidatePath("/notifications");
  return result;
}
