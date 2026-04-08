import type { BaseEntity } from "./base";

export interface AiFeature extends BaseEntity {
  slug: string;
  name: string;
  description: string;
  creditCost: number;
  freeRefresh: boolean;
  promptSlug: string;
  useProfile: boolean;
  enabled: boolean;
}
