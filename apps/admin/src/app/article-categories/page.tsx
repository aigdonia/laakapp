import { PageLayout } from "@/components/page-layout"
import { listArticleCategories } from "./actions"
import { listLanguages } from "@/app/languages/actions"
import { ArticleCategoriesTable } from "./article-categories-table"

export default async function ArticleCategoriesPage() {
  const [categories, languages] = await Promise.all([
    listArticleCategories(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Article Categories"
      description="Organize articles into categories."
    >
      <ArticleCategoriesTable categories={categories} languages={languages} />
    </PageLayout>
  )
}
