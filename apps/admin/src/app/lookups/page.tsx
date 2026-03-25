import { PageLayout } from "@/components/page-layout"
import { listLookups } from "./actions"
import { listLanguages } from "../languages/actions"
import { LookupsTable } from "./lookups-table"

export default async function LookupsPage() {
  const [lookups, languages] = await Promise.all([
    listLookups(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Lookups"
      description="Manage reusable option lists (currencies, exchanges, units) referenced by asset class fields."
    >
      <LookupsTable lookups={lookups} languages={languages} />
    </PageLayout>
  )
}
