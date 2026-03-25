import { PageLayout } from "@/components/page-layout"
import { listScreeningRules } from "./actions"
import { listLanguages } from "../languages/actions"
import { ScreeningRulesTable } from "./screening-rules-table"

export default async function ScreeningRulesPage() {
  const [rules, languages] = await Promise.all([
    listScreeningRules(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Screening Rules"
      description="Manage Sharia screening methodologies and their thresholds."
    >
      <ScreeningRulesTable rules={rules} languages={languages} />
    </PageLayout>
  )
}
