import type { BaseEntity, Translations } from "./base";

export interface ArticleCategory extends BaseEntity {
  title: string;
  slug: string;
  icon: string;
  order: number;
  enabled: boolean;
  translations: Translations;
}
