import type { BaseEntity } from "./base";

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  body: string;
  languageCode: string;
  status: ArticleStatus;
  publishedAt: string | null;
  categoryId: string | null;
}
