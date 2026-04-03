import { PageLayout } from "@/components/page-layout"
import { getUser, listLearningCardsForTest, listMicroLessonsForTest } from "../actions"
import { UserDetail } from "./user-detail"

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [user, learningCards, microLessons] = await Promise.all([
    getUser(id),
    listLearningCardsForTest(),
    listMicroLessonsForTest(),
  ])

  return (
    <PageLayout
      title={`User ${id.slice(0, 8)}…`}
      description="Full user profile, activity, credits, devices, and backups."
    >
      <UserDetail user={user} learningCards={learningCards} microLessons={microLessons} />
    </PageLayout>
  )
}
