import type { BaseEntity, Translations } from "./base";

export interface Country extends BaseEntity {
  name: string;
  code: string;
  currency: string;
  flagEmoji: string;
  enabled: boolean;
  translations: Translations;
}
