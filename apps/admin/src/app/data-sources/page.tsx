import { PageLayout } from "@/components/page-layout"
import { listDataSources } from "./actions"
import { DataSourcesTable } from "./data-sources-table"

export default async function DataSourcesPage() {
  const dataSources = await listDataSources()

  return (
    <PageLayout
      title="Data Sources"
      description="Manage scraping and index list sources for financial data."
    >
      <DataSourcesTable dataSources={dataSources} />
    </PageLayout>
  )
}
