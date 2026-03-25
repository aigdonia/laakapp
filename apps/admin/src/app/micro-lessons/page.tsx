import { PageLayout } from "@/components/page-layout"
import { listMicroLessons } from "./actions"
import { listLanguages } from "@/app/languages/actions"
import { MicroLessonsTable } from "./micro-lessons-table"

export default async function MicroLessonsPage() {
  const [microLessons, languages] = await Promise.all([
    listMicroLessons(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Micro Lessons"
      description="Manage bite-sized educational content."
    >
      <MicroLessonsTable microLessons={microLessons} languages={languages} />
    </PageLayout>
  )
}
