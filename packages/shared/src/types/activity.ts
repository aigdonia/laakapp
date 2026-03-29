import type { BaseEntity } from "./base";

export type ActivityActionType =
  | "reward_credits"
  | "show_micro_lesson"
  | "show_learning_card"
  | "show_toast"
  | "show_confetti"
  | "unlock_feature";

export interface EventType extends BaseEntity {
  slug: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface ActivityRule extends BaseEntity {
  name: string;
  eventType: string;
  threshold: number;
  actionType: ActivityActionType;
  actionPayload: Record<string, unknown>;
  enabled: boolean;
  order: number;
}

export interface TriggeredAction {
  actionType: ActivityActionType;
  payload: Record<string, unknown>;
}

export interface ReportEventResponse {
  triggered: TriggeredAction[];
  throttled?: boolean;
}

export interface RuleTestResult {
  eventCount: number;
  threshold: number;
  wouldTrigger: boolean;
  alreadyCompleted: boolean;
}
