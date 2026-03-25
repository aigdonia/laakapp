import { PageLayout } from "@/components/page-layout"
import { listCountries } from "./actions"
import { listLanguages } from "../languages/actions"
import { CountriesTable } from "./countries-table"

export default async function CountriesPage() {
  const [countries, languages] = await Promise.all([
    listCountries(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Countries"
      description="Manage supported countries and markets."
    >
      <CountriesTable countries={countries} languages={languages} />
    </PageLayout>
  )
}
