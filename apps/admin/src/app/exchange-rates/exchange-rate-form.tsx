"use client"

import { useState } from "react"
import type { Lookup } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { createExchangeRate } from "./actions"
import { toast } from "sonner"

export function ExchangeRateForm({
  open,
  onOpenChange,
  currencyLookups,
  existingCurrencies,
  baseCurrency,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currencyLookups: Lookup[]
  existingCurrencies: Set<string>
  baseCurrency: string
}) {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Lookup | null>(null)

  const available = currencyLookups.filter(
    (l) => !existingCurrencies.has(l.value)
  )

  const filtered = available.filter((l) => {
    const q = search.toLowerCase()
    return (
      l.value.toLowerCase().includes(q) ||
      l.label.toLowerCase().includes(q)
    )
  })

  function reset() {
    setSearch("")
    setSelected(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const ratePerUsd = parseFloat(form.get("ratePerUsd") as string)

    try {
      await createExchangeRate({
        currency: selected.value,
        ratePerUsd,
        enabled: true,
      })
      toast.success(`Added ${selected.value}`)
      reset()
      onOpenChange(false)
    } catch {
      toast.error("Failed to add currency")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Currency</SheetTitle>
          <SheetDescription>
            Select a currency and set its exchange rate relative to USD.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
          {/* Currency picker */}
          <div className="flex flex-col gap-2">
            <Label>Currency</Label>
            {selected ? (
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const meta = (selected.metadata ?? {}) as Record<string, string>
                    return meta?.flag ? (
                      <span className="text-lg">{meta.flag}</span>
                    ) : null
                  })()}
                  <span className="font-semibold font-mono">{selected.value}</span>
                  <span className="text-sm text-muted-foreground">{selected.label}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Search by code or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto rounded-md border">
                  {filtered.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                      {available.length === 0
                        ? "All currencies already added"
                        : "No matches"}
                    </div>
                  ) : (
                    filtered.map((l) => {
                      const meta = (l.metadata ?? {}) as Record<string, string>
                      return (
                        <button
                          type="button"
                          key={l.value}
                          onClick={() => {
                            setSelected(l)
                            setSearch("")
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-start hover:bg-muted/60 transition-colors text-sm"
                        >
                          {meta?.flag && (
                            <span className="text-base leading-none">{meta.flag}</span>
                          )}
                          <span className="font-semibold font-mono">{l.value}</span>
                          {meta?.symbol && (
                            <span className="text-xs text-muted-foreground bg-muted rounded px-1 py-0.5">
                              {meta.symbol}
                            </span>
                          )}
                          <span className="text-muted-foreground">{l.label}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rate input — only when currency selected */}
          {selected && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="ratePerUsd">Rate per 1 {baseCurrency}</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">1 {baseCurrency} =</span>
                <Input
                  id="ratePerUsd"
                  name="ratePerUsd"
                  type="number"
                  step="any"
                  min="0"
                  placeholder={selected.value === baseCurrency ? "1" : "0.00"}
                  defaultValue={selected.value === baseCurrency ? "1" : undefined}
                  required
                  autoFocus
                  className="tabular-nums"
                />
                <span className="text-sm font-medium font-mono">{selected.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                How many units of this currency equal 1 {baseCurrency}
              </p>
            </div>
          )}

          <SheetFooter>
            <Button type="submit" disabled={loading || !selected}>
              {loading ? "Adding..." : "Add Currency"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
