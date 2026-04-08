"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AiFeature, Prompt } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { createAiFeature, updateAiFeature, deleteAiFeature } from "./actions"
import { toast } from "sonner"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "")
}

// ─── Form ──────────────────────────────────────────

function FeatureForm({
  open,
  onOpenChange,
  feature,
  prompts,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: AiFeature
  prompts: Prompt[]
}) {
  const router = useRouter()
  const isEditing = !!feature
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(feature?.slug ?? "")

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEditing) {
      setSlug(slugify(e.target.value))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      description: form.get("description") as string,
      creditCost: parseInt(form.get("creditCost") as string) || 0,
      freeRefresh: form.get("freeRefresh") === "on",
      promptSlug: form.get("promptSlug") as string,
      useProfile: form.get("useProfile") === "on",
      enabled: form.get("enabled") === "on",
    }

    try {
      if (isEditing) {
        await updateAiFeature(feature.id, data)
        toast.success(`Updated ${data.name}`)
      } else {
        await createAiFeature(data)
        toast.success(`Created ${data.name}`)
      }
      router.refresh()
      onOpenChange(false)
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to create")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Feature" : "Add Feature"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the AI feature configuration."
              : "Configure a new AI feature."}
          </SheetDescription>
        </SheetHeader>

        <form key={feature?.id ?? "create"} onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Portfolio Narrative"
              defaultValue={feature?.name}
              required
              onChange={handleNameChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="narrative"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              readOnly={isEditing}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="What this feature does..."
              defaultValue={feature?.description}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="creditCost">Credit Cost</Label>
              <Input
                id="creditCost"
                name="creditCost"
                type="number"
                min="0"
                step="1"
                placeholder="2"
                defaultValue={feature?.creditCost ?? 0}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="promptSlug">Entry Prompt</Label>
              <select
                id="promptSlug"
                name="promptSlug"
                defaultValue={feature?.promptSlug}
                required
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select prompt...</option>
                {prompts.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="freeRefresh">Free Refresh</Label>
              <p className="text-xs text-muted-foreground">
                Allow free regeneration after portfolio changes
              </p>
            </div>
            <Switch
              id="freeRefresh"
              name="freeRefresh"
              defaultChecked={feature?.freeRefresh ?? false}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="useProfile">Use Profile</Label>
              <p className="text-xs text-muted-foreground">
                Inject user onboarding answers into AI payload
              </p>
            </div>
            <Switch
              id="useProfile"
              name="useProfile"
              defaultChecked={feature?.useProfile ?? false}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={feature?.enabled ?? true}
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// ─── Table ─────────────────────────────────────────

export function AiFeaturesTable({
  features,
  prompts,
}: {
  features: AiFeature[]
  prompts: Prompt[]
}) {
  const router = useRouter()
  const [editingFeature, setEditingFeature] = useState<AiFeature | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(feature: AiFeature) {
    try {
      await deleteAiFeature(feature.id)
      router.refresh()
      toast.success(`Deleted ${feature.name}`)
    } catch {
      toast.error("Failed to delete feature")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Feature
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Name</th>
              <th className="px-4 py-3 text-start font-medium">Slug</th>
              <th className="px-4 py-3 text-start font-medium">Credits</th>
              <th className="px-4 py-3 text-start font-medium">Free Refresh</th>
              <th className="px-4 py-3 text-start font-medium">Profile</th>
              <th className="px-4 py-3 text-start font-medium">Prompt</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {features.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No AI features configured. Add your first feature.
                </td>
              </tr>
            )}
            {features.map((feature) => (
              <tr key={feature.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    className="hover:underline text-start"
                    onClick={() => setEditingFeature(feature)}
                  >
                    {feature.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {feature.slug}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{feature.creditCost} cr</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {feature.freeRefresh ? "Yes" : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {feature.useProfile ? "Yes" : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {feature.promptSlug}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={feature.enabled ? "success" : "secondary"}>
                    {feature.enabled ? "Enabled" : "Disabled"}
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
                      <DropdownMenuItem onClick={() => setEditingFeature(feature)}>
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(feature)}
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

      <FeatureForm
        open={showCreate}
        onOpenChange={setShowCreate}
        prompts={prompts}
      />

      <FeatureForm
        key={editingFeature?.id}
        open={!!editingFeature}
        onOpenChange={(open) => {
          if (!open) setEditingFeature(null)
        }}
        feature={editingFeature ?? undefined}
        prompts={prompts}
      />
    </>
  )
}
