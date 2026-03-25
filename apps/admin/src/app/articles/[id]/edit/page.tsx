import { PageLayout } from "@/components/page-layout"
import { getArticle } from "../../actions"
import { listLanguages } from "@/app/languages/actions"
import { listArticleCategories } from "@/app/article-categories/actions"
import { ArticleForm } from "../../article-form"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [article, languages, categories] = await Promise.all([
    getArticle(id),
    listLanguages(),
    listArticleCategories(),
  ])

  return (
    <PageLayout title="Edit Article">
      <ArticleForm article={article} languages={languages} categories={categories} />
    </PageLayout>
  )
}
