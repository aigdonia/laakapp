import type { BaseEntity, Translations } from "./base";

export type FieldType =
  | "number"
  | "text"
  | "segment"
  | "date"
  | "stock"
  | "etf"
  | `lookup:${string}`;

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[]; // only for type="segment" (or resolved lookup)
  required?: boolean;
  advanced?: boolean;
  suffix?: string;
}

export interface AssetClass extends BaseEntity {
  name: string;
  slug: string;
  icon: string;
  color: string;
  order: number;
  enabled: boolean;
  translations: Translations;
  fields: FieldConfig[];
  aggregationKeys: string[];
}
