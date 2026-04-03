"use client"

import { useState } from "react"
import type { EventType } from "@fin-ai/shared"
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
import { createEventType, updateEventType, deleteEventType } from "./actions"
import { toast } from "sonner"

type MetadataField = { key: string; label: string; type: "string" | "number" | "boolean" }

type FormData = {
  slug: string
  label: string
  description: string
  metadataSchema: MetadataField[]
  enabled: boolean
}

const emptyForm: FormData = {
  slug: "",
  label: "",
  description: "",
  metadataSchema: [],
  enabled: true,
}

export function EventTypesTable({ eventTypes }: { eventTypes: EventType[] }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<EventType | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setSheetOpen(true)
  }

  function openEdit(et: EventType) {
    setEditing(et)
    setForm({
      slug: et.slug,
      label: et.label,
      description: et.description,
      metadataSchema: (et as any).metadataSchema ?? [],
      enabled: et.enabled,
    })
    setSheetOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await updateEventType(editing.id, form)
        toast.success("Event type updated")
      } else {
        await createEventType(form)
        toast.success("Event type created")
      }
      setSheetOpen(false)
    } catch {
      toast.error("Failed to save event type")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEventType(id)
      toast.success("Event type deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <IconPlus className="mr-2 h-4 w-4" />
          New Event Type
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Label</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventTypes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No event types yet. Create your first one.
                </td>
              </tr>
            )}
            {eventTypes.map((et) => (
              <tr key={et.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {et.slug}
                  </code>
                </td>
                <td className="px-4 py-3 font-medium">{et.label}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs max-w-[300px] truncate">
                  {et.description}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={et.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {et.enabled ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted">
                      <IconDots className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(et)}>
                        <IconPencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(et.id)}
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Event Type" : "New Event Type"}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Update this event type."
                : "Register a new event type for activity rules."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="holding_added"
                disabled={!!editing}
              />
              <p className="text-xs text-muted-foreground">
                Must match the event name used in mobile code.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Holding Added"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Fires when user saves a new holding"
              />
            </div>

            {/* Metadata Schema */}
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Event Metadata Fields
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Define the metadata keys this event sends from mobile. Used for activity rule conditions.
              </p>
              <div className="space-y-2">
                {form.metadataSchema.map((field, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      className="flex-1"
                      placeholder="key"
                      value={field.key}
                      onChange={(e) => {
                        const updated = [...form.metadataSchema]
                        updated[i] = { ...field, key: e.target.value }
                        setForm({ ...form, metadataSchema: updated })
                      }}
                    />
                    <Input
                      className="flex-1"
                      placeholder="Label"
                      value={field.label}
                      onChange={(e) => {
                        const updated = [...form.metadataSchema]
                        updated[i] = { ...field, label: e.target.value }
                        setForm({ ...form, metadataSchema: updated })
                      }}
                    />
                    <select
                      className="flex h-10 rounded-md border border-input bg-background px-2 py-2 text-sm"
                      value={field.type}
                      onChange={(e) => {
                        const updated = [...form.metadataSchema]
                        updated[i] = { ...field, type: e.target.value as MetadataField["type"] }
                        setForm({ ...form, metadataSchema: updated })
                      }}
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setForm({
                          ...form,
                          metadataSchema: form.metadataSchema.filter((_, j) => j !== i),
                        })
                      }}
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm({
                      ...form,
                      metadataSchema: [
                        ...form.metadataSchema,
                        { key: "", label: "", type: "string" },
                      ],
                    })
                  }
                >
                  <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                  Add Field
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="enabled"
                checked={form.enabled}
                onCheckedChange={(checked) => setForm({ ...form, enabled: checked })}
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.slug || !form.label}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
