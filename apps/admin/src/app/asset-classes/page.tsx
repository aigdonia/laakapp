import { PageLayout } from "@/components/page-layout"
import { listAssetClasses } from "./actions"
import { listLanguages } from "../languages/actions"
import { listLookups } from "../lookups/actions"
import { AssetClassesTable } from "./asset-classes-table"

export default async function AssetClassesPage() {
  const [assetClasses, languages, lookups] = await Promise.all([
    listAssetClasses(),
    listLanguages(),
    listLookups(),
  ])

  const lookupCategories = [...new Set(lookups.map((l) => l.category))].sort()

  return (
    <PageLayout
      title="Asset Classes"
      description="Manage investment categories available in the app."
    >
      <AssetClassesTable
        assetClasses={assetClasses}
        languages={languages}
        lookupCategories={lookupCategories}
      />
    </PageLayout>
  )
}
