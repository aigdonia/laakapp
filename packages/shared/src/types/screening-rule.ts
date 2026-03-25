import type { BaseEntity, Translations } from "./base";

export interface ScreeningRule extends BaseEntity {
  name: string;
  slug: string;
  methodology: string;
  description: string;
  thresholds: Record<string, number>;
  enabled: boolean;
  translations: Translations;
}
