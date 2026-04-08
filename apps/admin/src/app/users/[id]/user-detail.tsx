"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { IconPlayerPlay, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { resetUserData, fireTestAction, updateUserNotes, type UserDataCategory } from "../actions"
import type { UserDetail as UserDetailType } from "../actions"

function formatDate(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleString()
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: React.ReactNode[][]
}) {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No data.
      </p>
    )
  }
  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-muted-foreground">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-start font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b last:border-0">
              {cells.map((cell, j) => (
                <td key={j} className="px-4 py-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ResetButton({
  userId,
  category,
  label,
  count,
}: {
  userId: string
  category: UserDataCategory
  label: string
  count: number
}) {
  const [resetting, setResetting] = useState(false)

  if (count === 0) return null

  async function handleReset() {
    if (!confirm(`Delete all ${label.toLowerCase()} for this user? This cannot be undone.`)) return
    setResetting(true)
    try {
      await resetUserData(userId, category)
      toast.success(`${label} cleared`)
    } catch {
      toast.error(`Failed to clear ${label.toLowerCase()}`)
    } finally {
      setResetting(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleReset}
      disabled={resetting}
    >
      <IconTrash className="mr-1.5 h-3.5 w-3.5" />
      {resetting ? "Clearing..." : `Clear ${label}`}
    </Button>
  )
}

function TabHeader({
  userId,
  category,
  label,
  count,
  children,
}: {
  userId: string
  category: UserDataCategory
  label: string
  count: number
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>{children}</div>
      <ResetButton userId={userId} category={category} label={label} count={count} />
    </div>
  )
}

const ACTION_TYPES = [
  { value: "show_confetti", label: "Confetti + Celebration" },
  { value: "reward_credits", label: "Reward Credits" },
  { value: "show_toast", label: "Toast" },
  { value: "show_learning_card", label: "Learning Card" },
  { value: "show_micro_lesson", label: "Micro Lesson" },
] as const

function TestActionPanel({ userId, learningCards, microLessons }: {
  userId: string
  learningCards: PickItem[]
  microLessons: PickItem[]
}) {
  const [actionType, setActionType] = useState("")
  const [payload, setPayload] = useState<Record<string, string>>({})
  const [firing, setFiring] = useState(false)

  function updatePayload(key: string, value: string) {
    setPayload((prev) => {
      if (value === "") {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }

  async function handleFire() {
    if (!actionType) return
    setFiring(true)
    try {
      // Convert numeric fields
      const typed: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(payload)) {
        typed[k] = /^\d+$/.test(v) ? Number(v) : v
      }
      const result = await fireTestAction(userId, actionType, typed)
      toast.success(`Sent to device (${result.queued} queued)`)
    } catch {
      toast.error("Failed to send")
    } finally {
      setFiring(false)
    }
  }

  // Dynamic payload fields per action type
  type Field = { key: string; label: string; placeholder: string; options?: PickItem[] }
  const fields: Field[] = (() => {
    switch (actionType) {
      case "show_confetti":
        return [
          { key: "title", label: "Title", placeholder: "Milestone!" },
          { key: "message", label: "Message", placeholder: "Keep going!" },
          { key: "timeout", label: "Timeout (ms)", placeholder: "3000" },
        ]
      case "reward_credits":
        return [
          { key: "amount", label: "Amount", placeholder: "2" },
          { key: "message", label: "Message", placeholder: "You earned credits!" },
          { key: "timeout", label: "Timeout (ms)", placeholder: "3000" },
        ]
      case "show_toast":
        return [
          { key: "title", label: "Title", placeholder: "Nice!" },
          { key: "message", label: "Message", placeholder: "Keep up the great work" },
        ]
      case "show_learning_card":
        return [
          { key: "cardId", label: "Learning Card", placeholder: "", options: learningCards },
        ]
      case "show_micro_lesson":
        return [
          { key: "lessonId", label: "Micro Lesson", placeholder: "", options: microLessons },
        ]
      default:
        return []
    }
  })()

  return (
    <div className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 p-4 space-y-3">
      <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
        Test UI Action on Device
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <Label className="text-xs">Action</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value)
                setPayload({})
              }}
            >
              <option value="">Select action...</option>
              {ACTION_TYPES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            onClick={handleFire}
            disabled={firing || !actionType}
          >
            <IconPlayerPlay className="mr-1.5 h-3.5 w-3.5" />
            {firing ? "Sending..." : "Send"}
          </Button>
        </div>

        {fields.length > 0 && (
          <div className="flex items-end gap-3">
            {fields.map((f) => (
              <div key={f.key} className="flex-1 flex flex-col gap-1.5">
                <Label className="text-xs">{f.label}</Label>
                {f.options ? (
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={payload[f.key] ?? ""}
                    onChange={(e) => updatePayload(f.key, e.target.value)}
                  >
                    <option value="">Select...</option>
                    {f.options.map((o) => (
                      <option key={o.id} value={o.id}>{o.title}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    className="h-9"
                    placeholder={f.placeholder}
                    value={payload[f.key] ?? ""}
                    onChange={(e) => updatePayload(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type PickItem = { id: string; title: string }

export function UserDetail({ user, learningCards, microLessons }: {
  user: UserDetailType
  learningCards: PickItem[]
  microLessons: PickItem[]
}) {
  return (
    <div className="space-y-4">
      {/* User ID */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Full ID:</span>
        <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
          {user.id}
        </code>
      </div>

      {/* Test Action Panel */}
      <TestActionPanel userId={user.id} learningCards={learningCards} microLessons={microLessons} />

      <Tabs defaultValue="profile">
        <TabsList variant="line">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">
            Activity{" "}
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {user.events.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="credits">
            Credits{" "}
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {user.transactions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="devices">
            Devices{" "}
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {user.devices.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completions">
            Completions{" "}
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {user.completions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="backups">
            Backups{" "}
            <Badge variant="secondary" className="ml-1 text-[10px]">
              {user.backups.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <TabHeader userId={user.id} category="profile" label="Profile" count={user.profile ? 1 : 0}>
            {user.profile && (
              <p className="text-xs text-muted-foreground">
                Created: {formatDate(user.profile.createdAt)}
              </p>
            )}
          </TabHeader>
          {user.profile ? (
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 text-muted-foreground">
                    <th className="px-4 py-2.5 text-start font-medium w-1/3">
                      Question
                    </th>
                    <th className="px-4 py-2.5 text-start font-medium">
                      Answer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(user.profile.answers).map(([key, val]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {key}
                      </td>
                      <td className="px-4 py-2.5">
                        {Array.isArray(val) ? (
                          <div className="flex flex-wrap gap-1">
                            {val.map((v) => (
                              <Badge key={v} variant="outline">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span>{val}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No profile data. User has not completed onboarding.
            </p>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <TabHeader userId={user.id} category="activity" label="Activity" count={user.events.length} />
          <DataTable
            headers={["Event Type", "Metadata", "Time"]}
            rows={user.events.map((e) => [
              <Badge key="type" variant="outline">
                {e.eventType}
              </Badge>,
              <code key="meta" className="text-xs text-muted-foreground">
                {Object.keys(e.metadata).length > 0
                  ? JSON.stringify(e.metadata)
                  : "—"}
              </code>,
              <span key="time" className="text-xs text-muted-foreground">
                {formatDate(e.createdAt)}
              </span>,
            ])}
          />
        </TabsContent>

        {/* Credits Tab */}
        <TabsContent value="credits">
          <TabHeader userId={user.id} category="credits" label="Transactions" count={user.transactions.length} />
          <DataTable
            headers={["Feature", "Amount", "Balance After", "Status", "Time"]}
            rows={user.transactions.map((tx) => [
              <span key="f" className="font-mono text-xs">
                {tx.feature}
              </span>,
              <span
                key="a"
                className={`tabular-nums font-medium ${tx.amount < 0 ? "text-red-400" : "text-green-400"}`}
              >
                {tx.amount > 0 ? "+" : ""}
                {tx.amount}
              </span>,
              <span key="b" className="tabular-nums text-muted-foreground">
                {tx.balanceAfter ?? "—"}
              </span>,
              <Badge
                key="s"
                variant={
                  tx.status === "completed"
                    ? "success"
                    : tx.status === "refunded"
                      ? "outline"
                      : "destructive"
                }
              >
                {tx.status}
              </Badge>,
              <span key="t" className="text-xs text-muted-foreground">
                {formatDate(tx.createdAt)}
              </span>,
            ])}
          />
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <TabHeader userId={user.id} category="devices" label="Devices" count={user.devices.length} />
          <DataTable
            headers={["Platform", "Token", "Prefs", "Registered"]}
            rows={user.devices.map((d) => [
              <Badge key="p" variant="outline">
                {d.platform}
              </Badge>,
              <code key="t" className="text-xs text-muted-foreground">
                {d.expoToken.slice(0, 20)}…
              </code>,
              <span key="pr" className="text-xs">
                {d.prefs
                  ? Object.entries(d.prefs)
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join(", ") || "none"
                  : "—"}
              </span>,
              <span key="d" className="text-xs text-muted-foreground">
                {formatDate(d.createdAt)}
              </span>,
            ])}
          />
        </TabsContent>

        {/* Completions Tab */}
        <TabsContent value="completions">
          <TabHeader userId={user.id} category="completions" label="Completions" count={user.completions.length} />
          <DataTable
            headers={["Rule", "Event Type", "Action", "Completed"]}
            rows={user.completions.map((comp) => [
              <span key="r" className="font-medium">
                {comp.ruleName ?? comp.ruleId.slice(0, 8)}
              </span>,
              <Badge key="e" variant="outline">
                {comp.eventType ?? "—"}
              </Badge>,
              <Badge key="a" variant="secondary">
                {comp.actionType ?? "—"}
              </Badge>,
              <span key="d" className="text-xs text-muted-foreground">
                {formatDate(comp.completedAt)}
              </span>,
            ])}
          />
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups">
          <TabHeader userId={user.id} category="backups" label="Backups" count={user.backups.length} />
          <DataTable
            headers={["Transactions", "Size", "Schema", "Created"]}
            rows={user.backups.map((b) => [
              <span key="t" className="tabular-nums">
                {b.transactionCount}
              </span>,
              <span key="s" className="tabular-nums text-muted-foreground">
                {(b.sizeBytes / 1024).toFixed(1)} KB
              </span>,
              <span key="v" className="text-muted-foreground">
                v{b.schemaVersion}
              </span>,
              <span key="d" className="text-xs text-muted-foreground">
                {formatDate(b.createdAt)}
              </span>,
            ])}
          />
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <NotesEditor userId={user.id} notes={user.profile?.notes ?? ""} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotesEditor({ userId, notes: initialNotes }: { userId: string; notes: string }) {
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateUserNotes(userId, notes)
      toast.success("Notes saved")
    } catch {
      toast.error("Failed to save notes")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this user..."
        rows={8}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  )
}
