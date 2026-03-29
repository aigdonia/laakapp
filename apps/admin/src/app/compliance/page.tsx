import { PageLayout } from "@/components/page-layout"
import { listCompliance, listStocks, listScreeningRules } from "./actions"
import { ComplianceTable } from "./compliance-table"

export default async function CompliancePage() {
  const [compliance, stocks, rules] = await Promise.all([
    listCompliance(),
    listStocks(),
    listScreeningRules(),
  ])

  return (
    <PageLayout
      title="Compliance"
      description="View and manage Sharia compliance status for all stocks."
    >
      <ComplianceTable compliance={compliance} stocks={stocks} rules={rules} />
    </PageLayout>
  )
}
