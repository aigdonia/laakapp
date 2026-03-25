import type { BaseEntity, Translations } from "./base";

export interface CreditPackage extends BaseEntity {
  name: string;
  credits: number;
  priceUsd: number;
  region: string;
  enabled: boolean;
  order: number;
  translations: Translations;
}
