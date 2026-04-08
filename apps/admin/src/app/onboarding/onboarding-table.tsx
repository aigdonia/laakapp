"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type {
  OnboardingScreen,
  OnboardingScreenType,
  OnboardingChoice,
  Language,
  Translations,
} from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  IconDots,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react"
import {
  createOnboardingScreen,
  updateOnboardingScreen,
  deleteOnboardingScreen,
  reorderOnboardingScreens,
} from "./actions"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"
import { LocaleInput } from "@/components/locale-input"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const TYPE_LABELS: Record<OnboardingScreenType, string> = {
  informative: "Informative",
  text_input: "Text Input",
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice",
}

const TYPE_VARIANTS: Record<OnboardingScreenType, "default" | "secondary" | "outline"> = {
  informative: "default",
  text_input: "secondary",
  single_choice: "outline",
  multiple_choice: "outline",
}

function ScreenForm({
  open,
  onOpenChange,
  screen,
  languages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  screen?: OnboardingScreen
  languages: Language[]
}) {
  const router = useRouter()
  const isEditing = !!screen
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState(screen?.slug ?? "")
  const [type, setType] = useState<OnboardingScreenType>(screen?.type ?? "informative")
  const [choices, setChoices] = useState<OnboardingChoice[]>(screen?.choices ?? [])

  // Per-choice locale values: { [choiceIndex]: { [langCode]: string } }
  const [choiceLabels, setChoiceLabels] = useState<Record<number, Record<string, string>>>(() => {
    if (!screen) return {}
    const labels: Record<number, Record<string, string>> = {}
    screen.choices.forEach((choice, i) => {
      labels[i] = {}
      for (const [lang, fields] of Object.entries(screen.translations)) {
        const key = `choice:${choice.value}`
        if (fields[key]) {
          labels[i][lang] = fields[key]
        }
      }
    })
    return labels
  })

  function handleTitleChange(title: string) {
    if (!isEditing) {
      setSlug(slugify(title))
    }
  }

  function addChoice() {
    setChoices([...choices, { value: "" }])
  }

  function removeChoice(index: number) {
    setChoices(choices.filter((_, i) => i !== index))
    const updated = { ...choiceLabels }
    delete updated[index]
    // Re-index
    const reindexed: Record<number, Record<string, string>> = {}
    Object.keys(updated).forEach((k) => {
      const num = Number(k)
      if (num > index) {
        reindexed[num - 1] = updated[num]
      } else {
        reindexed[num] = updated[num]
      }
    })
    setChoiceLabels(reindexed)
  }

  function updateChoiceValue(index: number, value: string) {
    const updated = [...choices]
    updated[index] = { value }
    setChoices(updated)
  }

  function updateChoiceLabel(index: number, langCode: string, label: string) {
    setChoiceLabels((prev) => ({
      ...prev,
      [index]: { ...prev[index], [langCode]: label },
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    // Build translations from form fields + choice labels
    const translations: Translations = {}

    // Title & description per language
    for (const lang of languages) {
      const langCode = lang.code
      const isDefault = langCode === "en"
      translations[langCode] ??= {}

      const titleVal = isDefault
        ? (form.get("title") as string)?.trim()
        : (form.get(`title__${langCode}`) as string)?.trim()
      if (titleVal) translations[langCode].title = titleVal

      const descVal = isDefault
        ? (form.get("description") as string)?.trim()
        : (form.get(`description__${langCode}`) as string)?.trim()
      if (descVal) translations[langCode].description = descVal

      // Choice labels
      if (type === "single_choice" || type === "multiple_choice") {
        choices.forEach((choice, i) => {
          const label = choiceLabels[i]?.[langCode]
          if (label?.trim() && choice.value) {
            translations[langCode][`choice:${choice.value}`] = label.trim()
          }
        })
      }

      // Clean up empty lang objects
      if (Object.keys(translations[langCode]).length === 0) {
        delete translations[langCode]
      }
    }

    const validChoices = choices.filter((c) => c.value.trim())

    const data = {
      type,
      slug: form.get("slug") as string,
      imageUrl: (form.get("imageUrl") as string) || "",
      enabled: form.get("enabled") === "on",
      skippable: form.get("skippable") === "on",
      choices: validChoices,
      translations,
    }

    try {
      if (isEditing) {
        await updateOnboardingScreen(screen.id, data)
        toast.success("Updated screen")
      } else {
        await createOnboardingScreen(data)
        toast.success("Created screen")
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
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Screen" : "Add Screen"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the onboarding screen details."
              : "Configure a new onboarding screen."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as OnboardingScreenType)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="informative">Informative</option>
              <option value="text_input">Text Input</option>
              <option value="single_choice">Single Choice</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>

          <LocaleInput
            field="title"
            label="Title"
            languages={languages}
            defaultValue={screen?.translations?.en?.title}
            translations={screen?.translations}
            required
            placeholder="Welcome to Laak"
            onChange={(e) => handleTitleChange(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="welcome"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="font-mono text-xs"
            />
          </div>

          <LocaleInput
            field="description"
            label="Description"
            languages={languages}
            defaultValue={screen?.translations?.en?.description}
            translations={screen?.translations}
            placeholder="A brief description..."
            multiline={type === "informative"}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://..."
              defaultValue={screen?.imageUrl}
            />
          </div>

          {(type === "single_choice" || type === "multiple_choice") && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Choices</Label>
                <Button type="button" variant="outline" size="sm" onClick={addChoice}>
                  <IconPlus className="size-3.5" />
                  Add
                </Button>
              </div>
              {choices.map((choice, i) => (
                <div key={i} className="rounded-lg border p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="value_key"
                      value={choice.value}
                      onChange={(e) => updateChoiceValue(i, e.target.value)}
                      className="font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeChoice(i)}
                    >
                      <IconX className="size-3.5" />
                    </Button>
                  </div>
                  {languages.map((lang) => (
                    <div key={lang.code} className="relative">
                      <Input
                        placeholder={`Label (${lang.code})`}
                        value={choiceLabels[i]?.[lang.code] ?? ""}
                        onChange={(e) => updateChoiceLabel(i, lang.code, e.target.value)}
                        dir={lang.direction === "rtl" ? "rtl" : undefined}
                        className="pe-12"
                      />
                      <span className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground uppercase">
                        {lang.code}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
              {choices.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No choices yet. Click "Add" to create one.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch
              id="enabled"
              name="enabled"
              defaultChecked={screen?.enabled ?? true}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="skippable">Skippable</Label>
            <Switch
              id="skippable"
              name="skippable"
              defaultChecked={screen?.skippable ?? true}
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

export function OnboardingTable({
  screens,
  languages,
}: {
  screens: OnboardingScreen[]
  languages: Language[]
}) {
  const router = useRouter()
  const sorted = [...screens].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [editingScreen, setEditingScreen] = useState<OnboardingScreen | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(screen: OnboardingScreen) {
    try {
      await deleteOnboardingScreen(screen.id)
      router.refresh()
      toast.success("Deleted screen")
    } catch {
      toast.error("Failed to delete screen")
    }
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderOnboardingScreens(newIds).then(() => {
      router.refresh()
    }).catch(() => {
      toast.error("Failed to save order")
      setItems(sorted)
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Screen
        </Button>
      </div>

      <SortableTableProvider
        ids={items.map((i) => i.id)}
        onReorder={handleReorder}
      >
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground">
                <th className="w-10 px-2 py-3" />
                <th className="px-4 py-3 text-start font-medium">Type</th>
                <th className="px-4 py-3 text-start font-medium">Title</th>
                <th className="px-4 py-3 text-start font-medium">Slug</th>
                <th className="px-4 py-3 text-start font-medium">Status</th>
                <th className="px-4 py-3 text-end font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No onboarding screens yet. Add your first screen.
                  </td>
                </tr>
              )}
              {items.map((screen) => (
                <SortableRow
                  key={screen.id}
                  id={screen.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={screen.id} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={TYPE_VARIANTS[screen.type]}>
                      {TYPE_LABELS[screen.type]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <button type="button" className="hover:underline text-start" onClick={() => setEditingScreen(screen)}>
                      {screen.translations?.en?.title ?? screen.slug}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {screen.slug}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={screen.enabled ? "success" : "secondary"}>
                      {screen.enabled ? "Enabled" : "Disabled"}
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
                          onClick={() => setEditingScreen(screen)}
                        >
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(screen)}
                        >
                          <IconTrash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </SortableRow>
              ))}
            </tbody>
          </table>
        </div>
      </SortableTableProvider>

      <ScreenForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <ScreenForm
        key={editingScreen?.id}
        open={!!editingScreen}
        onOpenChange={(open) => {
          if (!open) setEditingScreen(null)
        }}
        screen={editingScreen ?? undefined}
        languages={languages}
      />
    </>
  )
}
