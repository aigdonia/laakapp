import { PageLayout } from "@/components/page-layout"
import { listAiFeatures, listPrompts } from "./actions"
import { AiFeaturesTable } from "./ai-features-table"

export default async function AiFeaturesPage() {
  const [features, prompts] = await Promise.all([
    listAiFeatures(),
    listPrompts(),
  ])

  return (
    <PageLayout
      title="AI Features"
      description="Configure credit-gated AI features and their pricing."
    >
      <AiFeaturesTable features={features} prompts={prompts} />
    </PageLayout>
  )
}
