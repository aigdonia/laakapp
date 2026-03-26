import { PageLayout } from "@/components/page-layout"
import { listPortfolioPresets } from "./actions"
import { listLanguages } from "../languages/actions"
import { listAssetClasses } from "../asset-classes/actions"
import { PresetsTable } from "./presets-table"

export default async function PortfolioPresetsPage() {
  const [presets, languages, assetClasses] = await Promise.all([
    listPortfolioPresets(),
    listLanguages(),
    listAssetClasses(),
  ])

  return (
    <PageLayout
      title="Portfolio Presets"
      description="Manage investment allocation templates for portfolio scoring."
    >
      <PresetsTable
        presets={presets}
        languages={languages}
        assetClasses={assetClasses}
      />
    </PageLayout>
  )
}
