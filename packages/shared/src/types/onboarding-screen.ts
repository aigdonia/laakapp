import type { BaseEntity, Translations } from "./base";

export type OnboardingScreenType =
  | "informative"
  | "text_input"
  | "single_choice"
  | "multiple_choice";

export interface OnboardingChoice {
  value: string;
}

export interface OnboardingScreen extends BaseEntity {
  type: OnboardingScreenType;
  slug: string;
  imageUrl: string;
  choices: OnboardingChoice[];
  order: number;
  enabled: boolean;
  translations: Translations;
}
