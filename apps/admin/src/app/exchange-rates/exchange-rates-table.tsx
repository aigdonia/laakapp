"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import type { ExchangeRate, Lookup } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPlus, IconTrash, IconAlertTriangle } from "@tabler/icons-react"
import { deleteExchangeRate, updateExchangeRate } from "./actions"
import { ExchangeRateForm } from "./exchange-rate-form"
import { toast } from "sonner"

const STALE_DAYS = 3

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function isStale(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() > STALE_DAYS * 86_400_000
}

function InlineRateInput({
  rate,
  baseCurrency,
  onSave,
}: {
  rate: ExchangeRate
  baseCurrency: string
  onSave: (id: string, value: number) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(rate.ratePerUsd))
  const [saving, setSaving] = useState(false)

  const save = useCallback(async () => {
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) {
      setValue(String(rate.ratePerUsd))
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await onSave(rate.id, num)
      setEditing(false)
    } catch {
      toast.error("Failed to update rate")
      setValue(String(rate.ratePerUsd))
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }, [value, rate.id, rate.ratePerUsd, onSave])

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground text-xs">1 {baseCurrency} =</span>
        <input
          type="number"
          step="any"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save()
            if (e.key === "Escape") {
              setValue(String(rate.ratePerUsd))
              setEditing(false)
            }
          }}
          onBlur={save}
          disabled={saving}
          autoFocus
          className="w-28 rounded-md border border-ring bg-background px-2 py-1 text-sm tabular-nums text-end outline-none"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 -my-1 hover:bg-muted/60 transition-colors cursor-text"
    >
      <span className="text-muted-foreground text-xs">1 USD =</span>
      <span className="tabular-nums font-medium">{rate.ratePerUsd}</span>
      <span className="text-muted-foreground text-xs">{rate.currency}</span>
    </button>
  )
}

export function ExchangeRatesTable({
  rates,
  currencyLookups,
  baseCurrency,
}: {
  rates: ExchangeRate[]
  currencyLookups: Lookup[]
  baseCurrency: string
}) {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)

  const existingCurrencies = new Set(rates.map((r) => r.currency))
  const lookupMap = new Map(currencyLookups.map((l) => [l.value, l]))

  // Pin USD to top, then sort by currency code
  const sorted = [...rates].sort((a, b) => {
    if (a.currency === baseCurrency) return -1
    if (b.currency === baseCurrency) return 1
    return a.currency.localeCompare(b.currency)
  })

  async function handleRateSave(id: string, ratePerUsd: number) {
    await updateExchangeRate(id, { ratePerUsd })
    router.refresh()
    toast.success("Rate updated")
  }

  async function handleToggleEnabled(rate: ExchangeRate) {
    try {
      await updateExchangeRate(rate.id, { enabled: !rate.enabled })
      router.refresh()
      toast.success(`${rate.currency} ${rate.enabled ? "disabled" : "enabled"}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  async function handleDelete(rate: ExchangeRate) {
    try {
      await deleteExchangeRate(rate.id)
      router.refresh()
      toast.success(`Deleted ${rate.currency}`)
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-xs">
            Base: {baseCurrency}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {rates.length} {rates.length === 1 ? "currency" : "currencies"}
          </span>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Currency
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Currency</th>
              <th className="px-4 py-3 text-start font-medium">Rate</th>
              <th className="px-4 py-3 text-start font-medium">Updated</th>
              <th className="px-4 py-3 text-center font-medium">Active</th>
              <th className="px-4 py-3 text-end font-medium" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <p className="font-medium">No currencies configured yet</p>
                    <p className="text-xs">Add USD as your base currency to get started.</p>
                  </div>
                </td>
              </tr>
            )}
            {sorted.map((rate) => {
              const lookup = lookupMap.get(rate.currency)
              const meta = (lookup?.metadata ?? {}) as Record<string, string>
              const isBase = rate.currency === baseCurrency
              const stale = !isBase && isStale(rate.updatedAt)

              return (
                <tr
                  key={rate.id}
                  className={`border-b last:border-b-0 transition-colors ${
                    isBase ? "bg-muted/30" : ""
                  } ${stale ? "border-s-2 border-s-amber-400" : ""} ${
                    !rate.enabled ? "opacity-50" : ""
                  }`}
                >
                  {/* Identity: Flag + Code + Name + Symbol */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {meta?.flag && (
                        <span className="text-lg leading-none">{meta.flag}</span>
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold font-mono">{rate.currency}</span>
                          {meta?.symbol && (
                            <span className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                              {meta.symbol}
                            </span>
                          )}
                          {isBase && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                              BASE
                            </Badge>
                          )}
                        </div>
                        {lookup && (
                          <span className="text-xs text-muted-foreground">
                            {lookup.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Rate — inline editable */}
                  <td className="px-4 py-3">
                    {isBase ? (
                      <span className="tabular-nums text-muted-foreground">1.00000</span>
                    ) : (
                      <InlineRateInput rate={rate} baseCurrency={baseCurrency} onSave={handleRateSave} />
                    )}
                  </td>

                  {/* Last updated */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {stale && (
                        <IconAlertTriangle className="size-3.5 text-amber-500 shrink-0" />
                      )}
                      <span className={`text-xs ${stale ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                        {timeAgo(rate.updatedAt)}
                      </span>
                    </div>
                  </td>

                  {/* Status toggle */}
                  <td className="px-4 py-3 text-center">
                    {isBase ? (
                      <span className="text-xs text-muted-foreground">Always on</span>
                    ) : (
                      <Switch
                        checked={rate.enabled}
                        onCheckedChange={() => handleToggleEnabled(rate)}
                      />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-end">
                    {!isBase && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-xs" />}
                        >
                          <IconDots className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(rate)}
                          >
                            <IconTrash />
                            Remove Currency
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ExchangeRateForm
        open={showCreate}
        onOpenChange={setShowCreate}
        currencyLookups={currencyLookups}
        existingCurrencies={existingCurrencies}
        baseCurrency={baseCurrency}
      />
    </>
  )
}
