"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconPlus,
  IconTrash,
  IconBrandReddit,
  IconBrandX,
  IconExternalLink,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { CONTENT_TYPES } from "./content-ops-data"

export type PostEntry = {
  id: string
  url: string
  platform: "reddit" | "x"
  contentType: string
  date: string
  createdAt: string
}

export function PostLog({
  posts,
  setPosts,
}: {
  posts: PostEntry[]
  setPosts: (v: PostEntry[] | ((prev: PostEntry[]) => PostEntry[])) => void
}) {
  const [url, setUrl] = useState("")
  const [platform, setPlatform] = useState<"reddit" | "x">("reddit")

  const handleUrlChange = (value: string) => {
    setUrl(value)
    const lower = value.toLowerCase()
    if (lower.includes("reddit.com") || lower.includes("redd.it")) {
      setPlatform("reddit")
    } else if (lower.includes("x.com") || lower.includes("twitter.com")) {
      setPlatform("x")
    }
  }
  const [contentType, setContentType] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const addPost = () => {
    if (!url.trim()) {
      toast.error("URL is required")
      return
    }
    const entry: PostEntry = {
      id: crypto.randomUUID(),
      url: url.trim(),
      platform,
      contentType: contentType || "Other",
      date,
      createdAt: new Date().toISOString(),
    }
    setPosts((prev: PostEntry[]) => [entry, ...prev])
    setUrl("")
    setContentType("")
    toast.success("Post logged")
  }

  const deletePost = (id: string) => {
    setPosts((prev: PostEntry[]) => prev.filter((p) => p.id !== id))
  }

  const sorted = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const display = sorted.slice(0, 20)

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Post Log
      </h3>

      {/* Add form */}
      <div className="flex flex-col gap-2 mb-4">
        <Input
          placeholder="Post URL..."
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPost()}
        />
        <div className="flex items-center gap-2">
          <Select
            value={platform}
            onValueChange={(v) => setPlatform(v as "reddit" | "x")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="x">X</SelectItem>
            </SelectContent>
          </Select>
          <Select value={contentType} onValueChange={(v) => setContentType(v ?? "")}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Content type..." />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((ct) => (
                <SelectItem key={ct} value={ct}>
                  {ct}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[140px]"
          />
          <Button onClick={addPost} size="sm">
            <IconPlus className="size-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Table */}
      {display.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No posts logged yet. Add your first one above.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[80px]">Platform</TableHead>
                <TableHead className="w-[140px]">Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {display.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="text-xs tabular-nums">
                    {post.date}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {post.platform === "reddit" ? (
                        <IconBrandReddit className="size-3.5 text-orange-500" />
                      ) : (
                        <IconBrandX className="size-3.5 text-blue-400" />
                      )}
                      <span className="text-xs capitalize">{post.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {post.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 max-w-[300px] truncate"
                    >
                      {post.url}
                      <IconExternalLink className="size-3 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => deletePost(post.id)}
                    >
                      <IconTrash className="size-3.5 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {posts.length > 20 && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Showing 20 of {posts.length} entries
        </p>
      )}
    </div>
  )
}
