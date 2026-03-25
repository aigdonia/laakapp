import type { BaseEntity, Translations } from "./base";

export interface Prompt extends BaseEntity {
  name: string;
  slug: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  translations: Translations;
}
