import type { BaseEntity } from "./base";

export type NotificationCategory = "marketing" | "content" | "onboarding";

export type NotificationStatus = "draft" | "scheduled" | "sent" | "failed";

export type NotificationTarget = "all" | "ios" | "android";

export interface PushToken extends BaseEntity {
  userId: string;
  expoToken: string;
  platform: "ios" | "android";
  prefs: NotificationPrefs;
}

export interface NotificationPrefs {
  marketing: boolean;
  content: boolean;
  onboarding: boolean;
}

export interface Notification extends BaseEntity {
  title: string;
  body: string;
  category: NotificationCategory;
  deepLink: string | null;
  target: NotificationTarget;
  scheduledAt: string | null;
  sentAt: string | null;
  status: NotificationStatus;
}

export interface NotificationLog {
  id: string;
  notificationId: string;
  expoToken: string;
  status: "sent" | "error" | "device_not_registered";
  errorMessage: string | null;
  createdAt: string;
}

/** Stats returned with notification campaigns */
export interface NotificationWithStats extends Notification {
  sent: number;
  errors: number;
  total: number;
}
