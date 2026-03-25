import type { BaseEntity, Translations } from "./base";

export interface Lookup extends BaseEntity {
  category: string;
  label: string;
  value: string;
  metadata: Record<string, string>;
  order: number;
  enabled: boolean;
  translations: Translations;
}
