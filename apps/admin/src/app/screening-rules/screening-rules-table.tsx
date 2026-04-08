"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ScreeningRule, Language } from "@fin-ai/shared"
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
import { deleteScreeningRule } from "./actions"
import { ScreeningRuleForm } from "./screening-rule-form"
import { toast } from "sonner"

export function ScreeningRulesTable({ rules, languages }: { rules: ScreeningRule[]; languages: Language[] }) {
  const router = useRouter()
  const [editingRule, setEditingRule] = useState<ScreeningRule | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(rule: ScreeningRule) {
    try {
      await deleteScreeningRule(rule.id)
      router.refresh()
      toast.success(`Deleted ${rule.name}`)
    } catch {
      toast.error("Failed to delete screening rule")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Rule
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Name</th>
              <th className="px-4 py-3 text-start font-medium">Slug</th>
              <th className="px-4 py-3 text-start font-medium">Methodology</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No screening rules yet. Add your first rule.
                </td>
              </tr>
            )}
            {rules.map((rule) => (
              <tr key={rule.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">
                  <button type="button" className="hover:underline text-start" onClick={() => setEditingRule(rule)}>
                    {rule.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {rule.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {rule.methodology}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={rule.enabled ? "success" : "secondary"}>
                    {rule.enabled ? "Enabled" : "Disabled"}
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
                        onClick={() => setEditingRule(rule)}
                      >
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(rule)}
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

      <ScreeningRuleForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <ScreeningRuleForm
        key={editingRule?.id}
        open={!!editingRule}
        onOpenChange={(open) => {
          if (!open) setEditingRule(null)
        }}
        rule={editingRule ?? undefined}
        languages={languages}
      />
    </>
  )
}
