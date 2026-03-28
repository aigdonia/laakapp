import { PageLayout } from "@/components/page-layout"
import { listCountries } from "./actions"
import { listLanguages } from "../languages/actions"
import { listCurrencyLookups } from "../exchange-rates/actions"
import { CountriesTable } from "./countries-table"

export default async function CountriesPage() {
  const [countries, languages, currencyLookups] = await Promise.all([
    listCountries(),
    listLanguages(),
    listCurrencyLookups(),
  ])

  return (
    <PageLayout
      title="Countries"
      description="Manage supported countries and markets."
    >
      <CountriesTable countries={countries} languages={languages} currencyLookups={currencyLookups} />
    </PageLayout>
  )
}
