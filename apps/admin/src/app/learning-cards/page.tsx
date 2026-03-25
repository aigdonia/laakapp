import { PageLayout } from "@/components/page-layout"
import { listLearningCards } from "./actions"
import { listLanguages } from "@/app/languages/actions"
import { LearningCardsTable } from "./learning-cards-table"

export default async function LearningCardsPage() {
  const [learningCards, languages] = await Promise.all([
    listLearningCards(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Learning Cards"
      description="Manage contextual learning cards triggered by user actions."
    >
      <LearningCardsTable learningCards={learningCards} languages={languages} />
    </PageLayout>
  )
}
