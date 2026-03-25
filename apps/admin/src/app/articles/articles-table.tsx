"use client"

import Link from "next/link"
import type { Article, ArticleCategory, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deleteArticle } from "./actions"
import { toast } from "sonner"

const statusVariant = {
  draft: "secondary",
  published: "success",
  archived: "outline",
} as const

export function ArticlesTable({
  articles,
  languages,
  categories,
}: {
  articles: Article[]
  languages: Language[]
  categories: ArticleCategory[]
}) {
  async function handleDelete(article: Article) {
    try {
      await deleteArticle(article.id)
      toast.success(`Deleted ${article.title}`)
    } catch {
      toast.error("Failed to delete article")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" render={<Link href="/articles/new" />}>
          <IconPlus data-icon="inline-start" />
          Add Article
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Title</th>
              <th className="px-4 py-3 text-start font-medium">Slug</th>
              <th className="px-4 py-3 text-start font-medium">Category</th>
              <th className="px-4 py-3 text-start font-medium">Language</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No articles yet. Add your first article.
                </td>
              </tr>
            )}
            {articles.map((article) => (
              <tr key={article.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{article.title}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {article.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categories.find((c) => c.id === article.categoryId)?.title ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {languages.find((l) => l.code === article.languageCode)?.name ?? article.languageCode}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[article.status]}>
                    {article.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-xs" />}
                    >
                      <IconDots className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        render={<Link href={`/articles/${article.id}/edit`} />}
                      >
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(article)}
                      >
                        <IconTrash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
