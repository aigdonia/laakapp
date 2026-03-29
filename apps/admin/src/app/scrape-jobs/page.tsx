import { PageLayout } from "@/components/page-layout"
import { listScrapeJobs, listDataSources } from "./actions"
import { ScrapeJobsTable } from "./scrape-jobs-table"

export default async function ScrapeJobsPage() {
  const [jobs, dataSources] = await Promise.all([
    listScrapeJobs(),
    listDataSources(),
  ])

  return (
    <PageLayout
      title="Scrape Jobs"
      description="Monitor and trigger data scraping jobs."
    >
      <ScrapeJobsTable jobs={jobs} dataSources={dataSources} />
    </PageLayout>
  )
}
