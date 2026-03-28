import type { BaseEntity, Translations } from "./base";

export interface Stock extends BaseEntity {
  symbol: string;
  name: string;
  countryCode: string;
  exchange: string;
  sector: string;
  enabled: boolean;
  lastPrice: number | null;
  lastPriceUpdatedAt: string | null;
  translations: Translations;
}
