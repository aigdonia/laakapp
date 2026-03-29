import { PageLayout } from "@/components/page-layout"
import {
  listActivityRules,
  listEventTypes,
  listMicroLessons,
  listLearningCards,
} from "./actions"
import { ActivityRulesTable } from "./activity-rules-table"

export default async function ActivityRulesPage() {
  const [rules, eventTypes, microLessons, learningCards] = await Promise.all([
    listActivityRules(),
    listEventTypes(),
    listMicroLessons(),
    listLearningCards(),
  ])

  return (
    <PageLayout
      title="Activity Rules"
      description="Define event-based triggers and rewards for user actions."
    >
      <ActivityRulesTable
        rules={rules}
        eventTypes={eventTypes}
        microLessons={microLessons}
        learningCards={learningCards}
      />
    </PageLayout>
  )
}
