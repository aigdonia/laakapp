import type { BaseEntity } from "./base";

export interface LearningCard extends BaseEntity {
  title: string;
  content: string;
  trigger: string;
  condition: string;
  order: number;
  languageCode: string;
}
