"use client"

import { useState, useMemo } from "react"
import type { Language, UiTranslation } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deleteUiTranslation, updateUiTranslation } from "./actions"
import { TranslationForm } from "./translation-form"
import { toast } from "sonner"

type GroupedKey = {
  key: string
  namespace: string
  /** languageCode → { id, value } */
  values: Record<string, { id: string; value: string }>
}

function groupTranslations(translations: UiTranslation[]): GroupedKey[] {
  const map = new Map<string, GroupedKey>()

  for (const t of translations) {
    const groupKey = `${t.namespace}::${t.key}`
    if (!map.has(groupKey)) {
      map.set(groupKey, { key: t.key, namespace: t.namespace, values: {} })
    }
    map.get(groupKey)!.values[t.languageCode] = {
      id: t.id,
      value: t.value,
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const ns = a.namespace.localeCompare(b.namespace)
    return ns !== 0 ? ns : a.key.localeCompare(b.key)
  })
}

function InlineEditCell({
  value,
  translationId,
  dir,
}: {
  value: string
  translationId: string
  dir?: string
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)

  async function save() {
    setEditing(false)
    if (text === value) return
    try {
      await updateUiTranslation(translationId, { value: text })
      toast.success("Updated")
    } catch {
      setText(value)
      toast.error("Failed to update")
    }
  }

  if (!editing) {
    return (
      <span
        className="cursor-pointer rounded px-1 py-0.5 hover:bg-muted"
        onClick={() => setEditing(true)}
        dir={dir}
      >
        {text}
      </span>
    )
  }

  return (
    <Input
      autoFocus
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save()
        if (e.key === "Escape") {
          setText(value)
          setEditing(false)
        }
      }}
      className="h-7 text-sm"
      dir={dir}
    />
  )
}

const NAMESPACES = [
  "all",
  "common",
  "portfolio",
  "screening",
  "learn",
  "settings",
  "onboarding",
  "errors",
]

export function TranslationsTable({
  translations,
  languages,
}: {
  translations: UiTranslation[]
  languages: Language[]
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupedKey | null>(null)
  const [namespaceFilter, setNamespaceFilter] = useState("all")
  const [search, setSearch] = useState("")

  const enabledLanguages = languages.filter((l) => l.enabled)
  const grouped = useMemo(() => groupTranslations(translations), [translations])

  const filtered = useMemo(() => {
    return grouped.filter((g) => {
      if (namespaceFilter !== "all" && g.namespace !== namespaceFilter)
        return false
      if (search && !g.key.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [grouped, namespaceFilter, search])

  async function handleDelete(group: GroupedKey) {
    try {
      for (const entry of Object.values(group.values)) {
        await deleteUiTranslation(entry.id)
      }
      toast.success(`Deleted "${group.key}"`)
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={namespaceFilter}
            onChange={(e) => setNamespaceFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {NAMESPACES.map((ns) => (
              <option key={ns} value={ns}>
                {ns === "all" ? "All Namespaces" : ns}
              </option>
            ))}
          </select>
          <Input
            placeholder="Search keys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-56"
          />
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Key
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Key</th>
              <th className="px-4 py-3 text-start font-medium">Namespace</th>
              {enabledLanguages.map((lang) => (
                <th
                  key={lang.code}
                  className="px-4 py-3 text-start font-medium"
                >
                  {lang.name} ({lang.code})
                </th>
              ))}
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3 + enabledLanguages.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No translation keys found.
                </td>
              </tr>
            )}
            {filtered.map((group) => (
              <tr
                key={`${group.namespace}::${group.key}`}
                className="border-b last:border-b-0"
              >
                <td className="px-4 py-3 font-mono text-xs">
                  <button type="button" className="hover:underline text-start" onClick={() => setEditingGroup(group)}>
                    {group.key}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{group.namespace}</Badge>
                </td>
                {enabledLanguages.map((lang) => {
                  const entry = group.values[lang.code]
                  return (
                    <td key={lang.code} className="px-4 py-3">
                      {entry ? (
                        <InlineEditCell
                          value={entry.value}
                          translationId={entry.id}
                          dir={lang.direction === "rtl" ? "rtl" : undefined}
                        />
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          missing
                        </Badge>
                      )}
                    </td>
                  )
                })}
                <td className="px-4 py-3 text-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-xs" />}
                    >
                      <IconDots className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingGroup(group)}
                      >
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(group)}
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

      <TranslationForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <TranslationForm
        key={editingGroup ? `${editingGroup.namespace}::${editingGroup.key}` : "none"}
        open={!!editingGroup}
        onOpenChange={(open) => {
          if (!open) setEditingGroup(null)
        }}
        languages={languages}
        existingKey={editingGroup?.key}
        existingNamespace={editingGroup?.namespace}
        existingValues={
          editingGroup
            ? Object.fromEntries(
                Object.entries(editingGroup.values).map(([code, entry]) => [
                  code,
                  entry.value,
                ])
              )
            : undefined
        }
      />
    </>
  )
}
