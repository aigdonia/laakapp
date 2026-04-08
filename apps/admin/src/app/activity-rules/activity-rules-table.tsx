"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type {
  ActivityRule,
  ActivityActionType,
  EventType,
  MicroLesson,
  LearningCard,
  RuleTestResult,
} from "@fin-ai/shared"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  IconAlertTriangle,
  IconDots,
  IconPencil,
  IconPlus,
  IconTrash,
  IconTestPipe,
} from "@tabler/icons-react"
import {
  createActivityRule,
  updateActivityRule,
  deleteActivityRule,
  reorderActivityRules,
  testActivityRule,
} from "./actions"
import { toast } from "sonner"
import {
  SortableTableProvider,
  SortableRow,
  DragHandle,
} from "@/components/sortable-table"

const ACTION_LABELS: Record<ActivityActionType, string> = {
  reward_credits: "Reward Credits",
  show_micro_lesson: "Show Micro Lesson",
  show_learning_card: "Show Learning Card",
  show_toast: "Show Toast",
  show_confetti: "Show Confetti",
  unlock_feature: "Unlock Feature",
}

const ACTION_COLORS: Record<ActivityActionType, string> = {
  reward_credits: "bg-amber-100 text-amber-800",
  show_micro_lesson: "bg-blue-100 text-blue-800",
  show_learning_card: "bg-indigo-100 text-indigo-800",
  show_toast: "bg-gray-100 text-gray-800",
  show_confetti: "bg-pink-100 text-pink-800",
  unlock_feature: "bg-purple-100 text-purple-800",
}

const ACTION_TYPES: ActivityActionType[] = [
  "reward_credits",
  "show_micro_lesson",
  "show_learning_card",
  "show_toast",
  "show_confetti",
  "unlock_feature",
]

type FormData = {
  name: string
  eventType: string
  threshold: number
  conditions: Record<string, unknown>
  actionType: ActivityActionType
  actionPayload: Record<string, unknown>
  enabled: boolean
}

const emptyForm: FormData = {
  name: "",
  eventType: "",
  threshold: 1,
  conditions: {},
  actionType: "show_toast",
  actionPayload: {},
  enabled: true,
}

export function ActivityRulesTable({
  rules,
  eventTypes,
  microLessons,
  learningCards,
}: {
  rules: ActivityRule[]
  eventTypes: EventType[]
  microLessons: MicroLesson[]
  learningCards: LearningCard[]
}) {
  const router = useRouter()
  const sorted = [...rules].sort((a, b) => a.order - b.order)
  const [items, setItems] = useState(sorted)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<ActivityRule | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  // Conflict detection: same eventType + same threshold among enabled rules
  const conflictIds = new Set<string>()
  const seen = new Map<string, string>() // "eventType:threshold" → first rule id
  for (const rule of items) {
    if (!rule.enabled) continue
    const key = `${rule.eventType}:${rule.threshold}`
    const existing = seen.get(key)
    if (existing) {
      conflictIds.add(existing)
      conflictIds.add(rule.id)
    } else {
      seen.set(key, rule.id)
    }
  }

  // Form conflict check: does another enabled rule share eventType + threshold?
  const formConflict = sheetOpen && form.eventType && form.enabled
    ? items.some((r) =>
        r.enabled &&
        r.eventType === form.eventType &&
        r.threshold === form.threshold &&
        r.id !== editing?.id
      )
    : false

  // Test dialog state
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [testRuleId, setTestRuleId] = useState("")
  const [testCustomerId, setTestCustomerId] = useState("")
  const [testResult, setTestResult] = useState<RuleTestResult | null>(null)
  const [testing, setTesting] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setSheetOpen(true)
  }

  function openEdit(rule: ActivityRule) {
    setEditing(rule)
    setForm({
      name: rule.name,
      eventType: rule.eventType,
      threshold: rule.threshold,
      conditions: (rule as any).conditions ?? {},
      actionType: rule.actionType as ActivityActionType,
      actionPayload: rule.actionPayload,
      enabled: rule.enabled,
    })
    setSheetOpen(true)
  }

  function openTest(ruleId: string) {
    setTestRuleId(ruleId)
    setTestCustomerId("")
    setTestResult(null)
    setTestDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const data = {
        name: form.name,
        eventType: form.eventType,
        threshold: form.threshold,
        conditions: form.conditions,
        actionType: form.actionType,
        actionPayload: form.actionPayload,
        enabled: form.enabled,
      }
      if (editing) {
        await updateActivityRule(editing.id, data)
        toast.success("Rule updated")
      } else {
        await createActivityRule(data)
        toast.success("Rule created")
      }
      router.refresh()
      setSheetOpen(false)
    } catch {
      toast.error("Failed to save rule")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteActivityRule(id)
      router.refresh()
      toast.success("Rule deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  async function handleTest() {
    setTesting(true)
    try {
      const result = await testActivityRule(testRuleId, testCustomerId)
      setTestResult(result)
    } catch {
      toast.error("Failed to test rule")
    } finally {
      setTesting(false)
    }
  }

  function updatePayload(key: string, value: unknown) {
    setForm({ ...form, actionPayload: { ...form.actionPayload, [key]: value } })
  }

  function handleReorder(newIds: string[]) {
    const reordered = newIds.map((id) => items.find((i) => i.id === id)!)
    setItems(reordered)
    reorderActivityRules(newIds).then(() => {
      router.refresh()
    }).catch(() => {
      toast.error("Failed to save order")
      setItems(sorted)
    })
  }

  function handleActionTypeChange(actionType: ActivityActionType) {
    setForm({ ...form, actionType, actionPayload: {} })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <IconPlus className="mr-2 h-4 w-4" />
          New Rule
        </Button>
      </div>

      {conflictIds.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          <IconAlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>{conflictIds.size} rules</strong> share the same event type and threshold — they will all fire on the same user action.
          </span>
        </div>
      )}

      <SortableTableProvider
        ids={items.map((i) => i.id)}
        onReorder={handleReorder}
      >
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-10 px-2 py-3" />
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Event</th>
                <th className="px-4 py-3 text-left font-medium">Threshold</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No activity rules yet. Create your first one.
                  </td>
                </tr>
              )}
              {items.map((rule) => (
                <SortableRow
                  key={rule.id}
                  id={rule.id}
                  className="border-b last:border-b-0 bg-background"
                >
                  <td className="w-10 px-2 py-3 text-center">
                    <DragHandle id={rule.id} />
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className="text-start" onClick={() => openEdit(rule)}>
                      <div className="flex items-center gap-1.5 font-medium hover:underline">
                        {rule.name}
                        {conflictIds.has(rule.id) && (
                          <IconAlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {rule.eventType}
                    </code>
                  </td>
                  <td className="px-4 py-3">{rule.threshold}x</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={ACTION_COLORS[rule.actionType as ActivityActionType] ?? ""}
                    >
                      {ACTION_LABELS[rule.actionType as ActivityActionType] ?? rule.actionType}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={rule.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {rule.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted">
                        <IconDots className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(rule)}>
                          <IconPencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openTest(rule.id)}>
                          <IconTestPipe className="mr-2 h-4 w-4" />
                          Test Rule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(rule.id)}
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
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

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Rule" : "New Rule"}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Update this activity rule."
                : "Create a new event-triggered rule."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="First holding bonus"
              />
            </div>

            {/* When this happens */}
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                When this happens
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <select
                    id="eventType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  >
                    <option value="">Select event...</option>
                    {eventTypes
                      .filter((et) => et.enabled)
                      .map((et) => (
                        <option key={et.id} value={et.slug}>
                          {et.label} ({et.slug})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="threshold">Times</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min={1}
                    value={form.threshold}
                    onChange={(e) =>
                      setForm({ ...form, threshold: parseInt(e.target.value) || 1 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Rule triggers on exactly the Nth event of this type.
                  </p>
                  {formConflict && (
                    <p className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                      <IconAlertTriangle className="h-3 w-3" />
                      Another enabled rule has the same event and threshold — both will fire together.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Conditions */}
            {(() => {
              const selectedEventType = eventTypes.find((et) => et.slug === form.eventType)
              const schema = (selectedEventType as any)?.metadataSchema as Array<{ key: string; label: string; type: string }> | undefined
              if (!schema || schema.length === 0) return null
              return (
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Only when
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Filter by event metadata. Leave empty to match all events of this type.
                  </p>
                  <div className="rounded-lg border p-3 space-y-3">
                    {schema.map((field) => (
                      <div key={field.key} className="flex flex-col gap-1.5">
                        <Label htmlFor={`cond_${field.key}`} className="text-xs">
                          {field.label || field.key}
                        </Label>
                        <Input
                          id={`cond_${field.key}`}
                          value={(form.conditions[field.key] as string) ?? ""}
                          onChange={(e) => {
                            const val = e.target.value
                            const updated = { ...form.conditions }
                            if (val === "") {
                              delete updated[field.key]
                            } else {
                              updated[field.key] = field.type === "number" ? Number(val) : val
                            }
                            setForm({ ...form, conditions: updated })
                          }}
                          placeholder={`Any ${field.label || field.key}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Do this */}
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Do this
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="actionType">Action</Label>
                  <select
                    id="actionType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.actionType}
                    onChange={(e) =>
                      handleActionTypeChange(e.target.value as ActivityActionType)
                    }
                  >
                    {ACTION_TYPES.map((at) => (
                      <option key={at} value={at}>
                        {ACTION_LABELS[at]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic payload fields */}
                <PayloadFields
                  actionType={form.actionType}
                  payload={form.actionPayload}
                  onUpdate={updatePayload}
                  microLessons={microLessons}
                  learningCards={learningCards}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="enabled"
                  checked={form.enabled}
                  onCheckedChange={(checked) => setForm({ ...form, enabled: checked })}
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.eventType}
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Test Rule Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Rule</DialogTitle>
            <DialogDescription>
              Check a customer&apos;s progress toward triggering this rule.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="testCustomerId">Customer ID</Label>
              <Input
                id="testCustomerId"
                value={testCustomerId}
                onChange={(e) => setTestCustomerId(e.target.value)}
                placeholder="RevenueCat customer ID"
              />
            </div>

            {testResult && (
              <div className="rounded-lg border p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event count</span>
                  <span className="font-mono">
                    {testResult.eventCount} / {testResult.threshold}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Would trigger</span>
                  <Badge
                    variant="outline"
                    className={testResult.wouldTrigger ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {testResult.wouldTrigger ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Already completed</span>
                  <Badge
                    variant="outline"
                    className={testResult.alreadyCompleted ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"}
                  >
                    {testResult.alreadyCompleted ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleTest} disabled={testing || !testCustomerId}>
              {testing ? "Testing..." : "Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TemplateHint() {
  return (
    <div className="rounded border border-dashed p-2.5 space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">Template variables</p>
      <p className="text-[11px] text-muted-foreground/70">
        Use <code className="bg-muted px-1 rounded text-[10px]">{"{{_event.key}}"}</code> in title/message to personalize with event metadata.
        E.g. <code className="bg-muted px-1 rounded text-[10px]">{"{{_event.assetType}}"}</code>, <code className="bg-muted px-1 rounded text-[10px]">{"{{_event.symbol}}"}</code>
      </p>
    </div>
  )
}

function PayloadFields({
  actionType,
  payload,
  onUpdate,
  microLessons,
  learningCards,
}: {
  actionType: ActivityActionType
  payload: Record<string, unknown>
  onUpdate: (key: string, value: unknown) => void
  microLessons: MicroLesson[]
  learningCards: LearningCard[]
}) {
  switch (actionType) {
    case "reward_credits":
      return (
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount (LAK)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              value={(payload.amount as number) ?? ""}
              onChange={(e) => onUpdate("amount", parseInt(e.target.value) || 0)}
              placeholder="2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={(payload.message as string) ?? ""}
              onChange={(e) => onUpdate("message", e.target.value)}
              placeholder="Nice! You added your first {{_event.assetType}}!"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="timeout">Dismiss after (ms)</Label>
            <Input
              id="timeout"
              type="number"
              min={1000}
              step={500}
              value={(payload.timeout as number) ?? ""}
              onChange={(e) => onUpdate("timeout", parseInt(e.target.value) || 3000)}
              placeholder="3000"
            />
            <p className="text-xs text-muted-foreground">
              How long the celebration card stays visible. Default: 3000ms.
            </p>
          </div>
          <TemplateHint />
        </div>
      )

    case "show_micro_lesson":
      return (
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="lessonId">Micro Lesson</Label>
            <select
              id="lessonId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={(payload.lessonId as string) ?? ""}
              onChange={(e) => onUpdate("lessonId", e.target.value)}
            >
              <option value="">Select lesson...</option>
              {microLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )

    case "show_learning_card":
      return (
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cardId">Learning Card</Label>
            <select
              id="cardId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={(payload.cardId as string) ?? ""}
              onChange={(e) => onUpdate("cardId", e.target.value)}
            >
              <option value="">Select card...</option>
              {learningCards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )

    case "show_toast":
      return (
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={(payload.title as string) ?? ""}
              onChange={(e) => onUpdate("title", e.target.value)}
              placeholder="Nice!"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={(payload.message as string) ?? ""}
              onChange={(e) => onUpdate("message", e.target.value)}
              placeholder="Keep up the great work!"
            />
          </div>
          <TemplateHint />
        </div>
      )

    case "show_confetti":
      return (
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={(payload.title as string) ?? ""}
              onChange={(e) => onUpdate("title", e.target.value)}
              placeholder="Milestone!"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={(payload.message as string) ?? ""}
              onChange={(e) => onUpdate("message", e.target.value)}
              placeholder="Keep up the great work!"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="timeout">Dismiss after (ms)</Label>
            <Input
              id="timeout"
              type="number"
              min={1000}
              step={500}
              value={(payload.timeout as number) ?? ""}
              onChange={(e) => onUpdate("timeout", parseInt(e.target.value) || 3000)}
              placeholder="3000"
            />
            <p className="text-xs text-muted-foreground">
              How long the celebration card stays visible. Default: 3000ms.
            </p>
          </div>
          <TemplateHint />
        </div>
      )

    case "unlock_feature":
      return (
        <div className="rounded-lg border p-3 space-y-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="featureKey">Feature Key</Label>
            <Input
              id="featureKey"
              value={(payload.featureKey as string) ?? ""}
              onChange={(e) => onUpdate("featureKey", e.target.value)}
              placeholder="portfolio_export"
            />
            <p className="text-xs text-muted-foreground">
              This key is checked in mobile code to gate features.
            </p>
          </div>
        </div>
      )

    default:
      return null
  }
}
