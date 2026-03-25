export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Translations = Record<string, Record<string, string>>;
