import { PageLayout } from "@/components/page-layout"
import { listLanguages } from "@/app/languages/actions"
import { listArticleCategories } from "@/app/article-categories/actions"
import { ArticleForm } from "../article-form"

export default async function NewArticlePage() {
  const [languages, categories] = await Promise.all([
    listLanguages(),
    listArticleCategories(),
  ])

  return (
    <PageLayout title="New Article">
      <ArticleForm languages={languages} categories={categories} />
    </PageLayout>
  )
}
