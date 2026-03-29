"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type {
  ActivityRule,
  EventType,
  MicroLesson,
  LearningCard,
  RuleTestResult,
} from "@fin-ai/shared";

export async function listActivityRules() {
  return api<ActivityRule[]>("/activity-rules");
}

export async function listEventTypes() {
  return api<EventType[]>("/event-types");
}

export async function listMicroLessons() {
  return api<MicroLesson[]>("/micro-lessons");
}

export async function listLearningCards() {
  return api<LearningCard[]>("/learning-cards");
}

export async function createActivityRule(data: {
  name: string;
  eventType: string;
  threshold: number;
  actionType: string;
  actionPayload: Record<string, unknown>;
  enabled: boolean;
}) {
  const result = await api<ActivityRule>("/activity-rules", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/activity-rules");
  return result;
}

export async function updateActivityRule(
  id: string,
  data: Partial<Omit<ActivityRule, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<ActivityRule>(`/activity-rules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/activity-rules");
  return result;
}

export async function deleteActivityRule(id: string) {
  await api(`/activity-rules/${id}`, { method: "DELETE" });
  revalidatePath("/activity-rules");
}

export async function testActivityRule(ruleId: string, customerId: string) {
  return api<RuleTestResult>(
    `/activity-rules/${ruleId}/test?customerId=${encodeURIComponent(customerId)}`
  );
}
