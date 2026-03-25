import { PageLayout } from "@/components/page-layout"
import { listArticles } from "./actions"
import { listLanguages } from "@/app/languages/actions"
import { listArticleCategories } from "@/app/article-categories/actions"
import { ArticlesTable } from "./articles-table"

export default async function ArticlesPage() {
  const [articles, languages, categories] = await Promise.all([
    listArticles(),
    listLanguages(),
    listArticleCategories(),
  ])

  return (
    <PageLayout
      title="Articles"
      description="Manage educational articles and content."
    >
      <ArticlesTable articles={articles} languages={languages} categories={categories} />
    </PageLayout>
  )
}
