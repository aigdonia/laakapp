import type { BaseEntity } from "./base";

export interface AppSettings extends BaseEntity {
  maintenanceMode: boolean;
  defaultLanguage: string;
  onboardingEnabled: boolean;
  baseCurrency: string;
  minAppVersion: string;
}
