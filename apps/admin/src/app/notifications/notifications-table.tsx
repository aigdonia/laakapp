"use client"

import { useState } from "react"
import type { NotificationWithStats, NotificationCategory, NotificationTarget } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  IconSend,
  IconTrash,
} from "@tabler/icons-react"
import {
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
} from "./actions"
import { toast } from "sonner"

const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  marketing: "bg-purple-100 text-purple-800",
  content: "bg-blue-100 text-blue-800",
  onboarding: "bg-green-100 text-green-800",
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  sent: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
}

type FormData = {
  title: string
  body: string
  category: NotificationCategory
  deepLink: string
  target: NotificationTarget
  scheduledAt: string
}

const emptyForm: FormData = {
  title: "",
  body: "",
  category: "marketing",
  deepLink: "",
  target: "all",
  scheduledAt: "",
}

export function NotificationsTable({
  notifications,
}: {
  notifications: NotificationWithStats[]
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<NotificationWithStats | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setSheetOpen(true)
  }

  function openEdit(n: NotificationWithStats) {
    setEditing(n)
    setForm({
      title: n.title,
      body: n.body,
      category: n.category as NotificationCategory,
      deepLink: n.deepLink ?? "",
      target: n.target as NotificationTarget,
      scheduledAt: n.scheduledAt ?? "",
    })
    setSheetOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const data = {
        title: form.title,
        body: form.body,
        category: form.category,
        deepLink: form.deepLink || undefined,
        target: form.target,
        scheduledAt: form.scheduledAt || undefined,
      }
      if (editing) {
        await updateNotification(editing.id, data)
        toast.success("Notification updated")
      } else {
        await createNotification(data)
        toast.success("Notification created")
      }
      setSheetOpen(false)
    } catch {
      toast.error("Failed to save notification")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNotification(id)
      toast.success("Notification deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  async function handleSend(id: string) {
    try {
      const result = await sendNotification(id)
      toast.success(`Sent to ${result.sent} devices (${result.errors} errors)`)
    } catch {
      toast.error("Failed to send notification")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <IconPlus className="mr-2 h-4 w-4" />
          New Notification
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Target</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Delivery</th>
              <th className="px-4 py-3 text-left font-medium">Scheduled</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No notifications yet. Create your first campaign.
                </td>
              </tr>
            )}
            {notifications.map((n) => (
              <tr key={n.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <button type="button" className="text-start" onClick={() => openEdit(n)}>
                    <div className="font-medium hover:underline">{n.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {n.body}
                    </div>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={CATEGORY_COLORS[n.category as NotificationCategory]}>
                    {n.category}
                  </Badge>
                </td>
                <td className="px-4 py-3 capitalize">{n.target}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={STATUS_COLORS[n.status]}>
                    {n.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs">
                  {n.status === "sent" ? (
                    <span>
                      {n.sent}/{n.total} delivered
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {n.scheduledAt ? (
                    new Date(n.scheduledAt).toLocaleString()
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconDots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {n.status !== "sent" && (
                        <>
                          <DropdownMenuItem onClick={() => openEdit(n)}>
                            <IconPencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSend(n.id)}>
                            <IconSend className="mr-2 h-4 w-4" />
                            Send Now
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(n.id)}
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
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editing ? "Edit Notification" : "New Notification"}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? "Update this notification campaign."
                : "Create a new push notification campaign."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Notification title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="body">Body</Label>
              <textarea
                id="body"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Notification message"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as NotificationCategory })
                }
              >
                <option value="marketing">Marketing</option>
                <option value="content">Content</option>
                <option value="onboarding">Onboarding</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="target">Target</Label>
              <select
                id="target"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.target}
                onChange={(e) =>
                  setForm({ ...form, target: e.target.value as NotificationTarget })
                }
              >
                <option value="all">All Devices</option>
                <option value="ios">iOS Only</option>
                <option value="android">Android Only</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="deepLink">Deep Link (optional)</Label>
              <Input
                id="deepLink"
                value={form.deepLink}
                onChange={(e) => setForm({ ...form, deepLink: e.target.value })}
                placeholder="laak://articles/123"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="scheduledAt">Schedule (optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to save as draft. Set a time to auto-send.
              </p>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.body}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
