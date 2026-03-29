"use client"

import { useState } from "react"
import type { StockCompliance, Stock, ScreeningRule } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlayerPlay, IconTrash } from "@tabler/icons-react"
import { deleteCompliance, runScreening } from "./actions"
import { ComplianceForm } from "./compliance-form"
import { toast } from "sonner"

const STATUS_VARIANT: Record<string, "success" | "destructive" | "secondary" | "outline"> = {
  compliant: "success",
  non_compliant: "destructive",
  doubtful: "outline",
  not_screened: "secondary",
}

const STATUS_LABEL: Record<string, string> = {
  compliant: "Compliant",
  non_compliant: "Non-Compliant",
  doubtful: "Doubtful",
  not_screened: "Not Screened",
}

export function ComplianceTable({
  compliance,
  stocks,
  rules,
}: {
  compliance: StockCompliance[]
  stocks: Stock[]
  rules: ScreeningRule[]
}) {
  const [editing, setEditing] = useState<StockCompliance | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [running, setRunning] = useState(false)

  const stockById = Object.fromEntries(stocks.map((s) => [s.id, s]))
  const ruleById = Object.fromEntries(rules.map((r) => [r.id, r]))

  async function handleDelete(item: StockCompliance) {
    try {
      await deleteCompliance(item.id)
      toast.success("Deleted compliance record")
    } catch {
      toast.error("Failed to delete")
    }
  }

  async function handleRunScreening() {
    setRunning(true)
    try {
      const result = await runScreening()
      toast.success(`Screened ${result.screened} stock-rule combinations (${result.stocks} stocks × ${result.rules} rules)`)
    } catch {
      toast.error("Failed to run screening")
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRunScreening}
          disabled={running}
        >
          <IconPlayerPlay data-icon="inline-start" />
          {running ? "Running..." : "Run Screening"}
        </Button>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          Override
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Stock</th>
              <th className="px-4 py-3 text-start font-medium">Symbol</th>
              <th className="px-4 py-3 text-start font-medium">Rule</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-start font-medium">Layer</th>
              <th className="px-4 py-3 text-start font-medium">Source</th>
              <th className="px-4 py-3 text-start font-medium">Valid From</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {compliance.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No compliance records yet. Run screening or add a manual override.
                </td>
              </tr>
            )}
            {compliance.map((item) => {
              const stock = stockById[item.stockId]
              const rule = ruleById[item.screeningRuleId]
              return (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">
                    {stock?.name ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {stock?.symbol ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {rule?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[item.status] ?? "secondary"}>
                      {STATUS_LABEL[item.status] ?? item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">
                    {item.layer}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.source === "manual_override" ? "Manual" : "Auto"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.validFrom}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" />}
                      >
                        <IconDots className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(item)}>
                          <IconPencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          <IconTrash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ComplianceForm
        open={showCreate}
        onOpenChange={setShowCreate}
        stocks={stocks}
        rules={rules}
      />

      <ComplianceForm
        key={editing?.id}
        open={!!editing}
        onOpenChange={(open) => { if (!open) setEditing(null) }}
        item={editing ?? undefined}
        stocks={stocks}
        rules={rules}
      />
    </>
  )
}
