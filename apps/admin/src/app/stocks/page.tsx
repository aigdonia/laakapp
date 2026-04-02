import { PageLayout } from "@/components/page-layout"
import { listScreeningRules, listExchangeLookups, listSectorLookups } from "./actions"
import { listLanguages } from "../languages/actions"
import { StocksTable } from "./stocks-table"

export default async function StocksPage() {
  const [screeningRules, exchangeLookups, sectorLookups, languages] = await Promise.all([
    listScreeningRules(),
    listExchangeLookups(),
    listSectorLookups(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Stocks"
      description="Manage stocks and their Sharia compliance screening."
    >
      <StocksTable
        screeningRules={screeningRules}
        exchangeLookups={exchangeLookups}
        sectorLookups={sectorLookups}
        languages={languages}
      />
    </PageLayout>
  )
}
