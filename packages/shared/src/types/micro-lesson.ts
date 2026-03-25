import type { BaseEntity } from "./base";

export interface MicroLesson extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  concept: string;
  languageCode: string;
  order: number;
}
