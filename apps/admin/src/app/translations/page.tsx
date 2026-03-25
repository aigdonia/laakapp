import { PageLayout } from "@/components/page-layout"
import { listUiTranslations } from "./actions"
import { TranslationsTable } from "./translations-table"
import { api } from "@/lib/api"
import type { Language } from "@fin-ai/shared"

export default async function TranslationsPage() {
  const [translations, languages] = await Promise.all([
    listUiTranslations(),
    api<Language[]>("/languages"),
  ])

  return (
    <PageLayout
      title="Translations"
      description="Manage UI string translations for the mobile app."
    >
      <TranslationsTable translations={translations} languages={languages} />
    </PageLayout>
  )
}
