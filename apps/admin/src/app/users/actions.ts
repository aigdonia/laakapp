"use server"

import { revalidatePath } from "next/cache"
import { api } from "@/lib/api"

export type UserSummary = {
  id: string
  country: string | null
  notes: string
  devices: number
  platforms: string
  events: number
  creditsSpent: number
  firstSeen: string | null
  lastActive: string | null
}

export type UserDetail = {
  id: string
  profile: {
    answers: Record<string, string | string[]>
    notes: string
    createdAt: string
  } | null
  events: Array<{
    id: string
    eventType: string
    metadata: Record<string, unknown>
    createdAt: string
  }>
  transactions: Array<{
    id: string
    feature: string
    amount: number
    balanceAfter: number | null
    status: string
    createdAt: string
  }>
  devices: Array<{
    id: string
    expoToken: string
    platform: string
    prefs: Record<string, boolean> | null
    createdAt: string
  }>
  completions: Array<{
    id: string
    ruleId: string
    ruleName: string | null
    eventType: string | null
    actionType: string | null
    completedAt: string
  }>
  backups: Array<{
    id: string
    transactionCount: number
    sizeBytes: number
    schemaVersion: number
    createdAt: string
  }>
}

export async function listUsers() {
  return api<UserSummary[]>("/admin/users")
}

export async function getUser(id: string) {
  return api<UserDetail>(`/admin/users/${id}`)
}

export type UserDataCategory = "profile" | "activity" | "credits" | "devices" | "completions" | "backups"

export async function resetUserData(userId: string, category: UserDataCategory) {
  const result = await api<{ success: boolean }>(`/admin/users/${userId}/${category}`, {
    method: "DELETE",
  })
  revalidatePath(`/users/${userId}`)
  return result
}

export async function listLearningCardsForTest() {
  return api<Array<{ id: string; title: string }>>("/learning-cards")
}

export async function listMicroLessonsForTest() {
  return api<Array<{ id: string; title: string }>>("/micro-lessons")
}

export async function updateUserNotes(userId: string, notes: string) {
  const result = await api<{ success: boolean }>(`/admin/users/${userId}/notes`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  })
  revalidatePath(`/users/${userId}`)
  return result
}

export async function fireTestAction(
  userId: string,
  actionType: string,
  payload: Record<string, unknown>,
) {
  return api<{ success: boolean; queued: number }>(`/admin/users/${userId}/test-action`, {
    method: "POST",
    body: JSON.stringify({ actionType, payload }),
  })
}
