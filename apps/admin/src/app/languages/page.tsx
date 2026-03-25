import { PageLayout } from "@/components/page-layout"
import { listLanguages } from "./actions"
import { LanguagesTable } from "./languages-table"

export default async function LanguagesPage() {
  const languages = await listLanguages()

  return (
    <PageLayout
      title="Languages"
      description="Manage supported languages and localizations."
    >
      <LanguagesTable languages={languages} />
    </PageLayout>
  )
}
