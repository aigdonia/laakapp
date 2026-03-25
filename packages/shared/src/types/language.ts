import type { BaseEntity } from "./base";

export type TextDirection = "ltr" | "rtl";

export interface Language extends BaseEntity {
  code: string;
  name: string;
  nativeName: string;
  direction: TextDirection;
  enabled: boolean;
}
