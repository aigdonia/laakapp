"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Article, ArticleCategory, ArticleStatus, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RichEditor } from "@/components/rich-editor"
import { createArticle, updateArticle } from "./actions"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

const statusVariant = {
  draft: "secondary",
  published: "success",
  archived: "outline",
} as const

export function ArticleForm({
  article,
  languages,
  categories,
}: {
  article?: Article
  languages: Language[]
  categories: ArticleCategory[]
}) {
  const router = useRouter()
  const isEditing = !!article
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(article?.slug ?? "")
  const [body, setBody] = useState(article?.body ?? "")
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "draft")

  function handleTitleChange(title: string) {
    if (!isEditing) {
      setSlug(slugify(title))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const currentStatus = form.get("status") as ArticleStatus
    let publishedAt = article?.publishedAt ?? null
    if (currentStatus === "published" && article?.status !== "published") {
      publishedAt = new Date().toISOString()
    }

    const categoryId = (form.get("categoryId") as string) || null

    const data = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      summary: (form.get("summary") as string) || "",
      body,
      languageCode: form.get("languageCode") as string,
      status: currentStatus,
      publishedAt,
      categoryId,
    }

    try {
      if (isEditing) {
        await updateArticle(article.id, data)
        toast.success(`Updated ${data.title}`)
      } else {
        await createArticle(data)
        toast.success(`Created ${data.title}`)
      }
      router.push("/articles")
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form key={article?.id ?? "create"} onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_280px]">
      {/* Main content column */}
      <div className="flex min-w-0 flex-col gap-4">
        <Input
          id="title"
          name="title"
          placeholder="Article title"
          defaultValue={article?.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="!h-auto border-0 px-0 !text-2xl font-bold shadow-none !ring-0 placeholder:text-muted-foreground/50"
        />

        <RichEditor content={body} onChange={setBody} />
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4 lg:gap-5">
        {/* Publish panel */}
        <div className="rounded-lg border">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-sm font-medium">Publish</span>
            <Badge variant={statusVariant[status]}>{status}</Badge>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status" className="text-xs text-muted-foreground">Status</Label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className={selectClass}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {article?.publishedAt && (
              <p className="text-xs text-muted-foreground">
                Published {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update" : "Publish"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/articles")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Slug panel */}
        <div className="rounded-lg border">
          <div className="border-b px-4 py-2.5">
            <span className="text-sm font-medium">Slug</span>
          </div>
          <div className="p-4">
            <Input
              id="slug"
              name="slug"
              placeholder="article-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="font-mono text-xs"
            />
          </div>
        </div>

        {/* Summary panel */}
        <div className="rounded-lg border">
          <div className="border-b px-4 py-2.5">
            <span className="text-sm font-medium">Summary</span>
          </div>
          <div className="p-4">
            <textarea
              id="summary"
              name="summary"
              placeholder="Brief description for previews and SEO..."
              defaultValue={article?.summary}
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>
        </div>

        {/* Category panel */}
        <div className="rounded-lg border">
          <div className="border-b px-4 py-2.5">
            <span className="text-sm font-medium">Category</span>
          </div>
          <div className="p-4">
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={article?.categoryId ?? ""}
              className={selectClass}
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language panel */}
        <div className="rounded-lg border">
          <div className="border-b px-4 py-2.5">
            <span className="text-sm font-medium">Language</span>
          </div>
          <div className="p-4">
            <select
              id="languageCode"
              name="languageCode"
              defaultValue={article?.languageCode ?? languages[0]?.code}
              className={selectClass}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </form>
  )
}
