import type { BaseEntity, Translations } from "./base"

export interface PortfolioPresetAllocations {
  [assetClassSlug: string]: number // values sum to 100
}

export interface PortfolioPreset extends BaseEntity {
  name: string
  slug: string
  description: string
  order: number
  enabled: boolean
  allocations: PortfolioPresetAllocations
  translations: Translations
}
