import type { BaseEntity } from "./base";

export interface ExchangeRate extends BaseEntity {
  currency: string; // ISO code: EGP, USD, SAR, MYR
  ratePerUsd: number; // units per 1 USD
  enabled: boolean;
}
