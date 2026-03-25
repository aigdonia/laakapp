import type { BaseEntity, Translations } from "./base";

export interface Affiliate extends BaseEntity {
  name: string;
  url: string;
  code: string;
  commissionPercent: number;
  category: string;
  enabled: boolean;
  translations: Translations;
}
