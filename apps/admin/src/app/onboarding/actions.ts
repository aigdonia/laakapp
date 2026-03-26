"use server";

import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";
import type { OnboardingScreen } from "@fin-ai/shared";

export async function listOnboardingScreens() {
  return api<OnboardingScreen[]>("/onboarding-screens");
}

export async function getOnboardingScreen(id: string) {
  return api<OnboardingScreen>(`/onboarding-screens/${id}`);
}

export async function createOnboardingScreen(
  data: Partial<Omit<OnboardingScreen, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<OnboardingScreen>("/onboarding-screens", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/onboarding");
  return result;
}

export async function updateOnboardingScreen(
  id: string,
  data: Partial<Omit<OnboardingScreen, "id" | "createdAt" | "updatedAt">>
) {
  const result = await api<OnboardingScreen>(`/onboarding-screens/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  revalidatePath("/onboarding");
  return result;
}

export async function deleteOnboardingScreen(id: string) {
  await api(`/onboarding-screens/${id}`, { method: "DELETE" });
  revalidatePath("/onboarding");
}

export async function reorderOnboardingScreens(ids: string[]) {
  await api("/onboarding-screens/reorder", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  revalidatePath("/onboarding");
}
