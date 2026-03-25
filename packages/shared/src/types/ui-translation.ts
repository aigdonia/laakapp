import type { BaseEntity } from "./base";

export interface UiTranslation extends BaseEntity {
  key: string;
  namespace: string;
  languageCode: string;
  value: string;
}

/** Flat bundle: { namespace: { key: value } } — matches i18next resource format */
export type TranslationBundle = Record<string, Record<string, string>>;

export interface TranslationBundleResponse {
  languageCode: string;
  version: number;
  bundle: TranslationBundle;
}

export interface TranslationVersionMap {
  [languageCode: string]: number;
}
