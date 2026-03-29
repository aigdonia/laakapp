"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import type {
  Stock,
  Lookup,
  ScreeningRule,
  StockCompliance,
  ComplianceStatus,
} from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  IconDots,
  IconPencil,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconTrash,
  IconUpload,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import {
  listStocksPaginated,
  listComplianceForStocks,
  updateComplianceStatus,
  createComplianceOverride,
  runScreening,
  deleteStock,
} from "./actions"
import { StockForm } from "./stock-form"
import { CsvImport } from "./csv-import"
import { toast } from "sonner"

const STATUS_COLORS: Record<string, string> = {
  compliant: "border-green-400 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 dark:border-green-700",
  non_compliant: "border-red-400 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 dark:border-red-700",
  doubtful: "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700",
  not_screened: "border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
}

const STATUS_LABELS: Record<string, string> = {
  compliant: "Compliant",
  non_compliant: "Non-Compliant",
  doubtful: "Doubtful",
  not_screened: "Not Screened",
}

const ALL_STATUSES: ComplianceStatus[] = [
  "compliant",
  "non_compliant",
  "doubtful",
  "not_screened",
]

export function StocksTable({
  screeningRules,
  exchangeLookups,
  sectorLookups,
}: {
  screeningRules: ScreeningRule[]
  exchangeLookups: Lookup[]
  sectorLookups: Lookup[]
}) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [compliance, setCompliance] = useState<StockCompliance[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [exchange, setExchange] = useState("")
  const [sector, setSector] = useState("")
  const [loading, startTransition] = useTransition()

  // Stock form
  const [formOpen, setFormOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<Stock | null>(null)
  // CSV import
  const [csvOpen, setCsvOpen] = useState(false)

  const limit = 20
  const totalPages = Math.ceil(total / limit)
  const enabledRules = screeningRules.filter((r) => r.enabled)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page on filter changes
  useEffect(() => {
    setPage(1)
  }, [exchange, sector])

  // Fetch stocks + compliance
  const fetchData = useCallback(async () => {
    startTransition(async () => {
      try {
        const result = await listStocksPaginated({
          page,
          limit,
          search: debouncedSearch || undefined,
          exchange: exchange || undefined,
          sector: sector || undefined,
        })
        setStocks(result.data)
        setTotal(result.total)

        // Fetch compliance for these stocks
        if (result.data.length > 0) {
          const ids = result.data.map((s) => s.id)
          const comp = await listComplianceForStocks(ids)
          setCompliance(comp)
        } else {
          setCompliance([])
        }
      } catch {
        toast.error("Failed to load stocks")
      }
    })
  }, [page, debouncedSearch, exchange, sector])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Build compliance lookup: stockId → { ruleId → StockCompliance }
  const complianceMap = new Map<string, Map<string, StockCompliance>>()
  for (const c of compliance) {
    if (!complianceMap.has(c.stockId)) {
      complianceMap.set(c.stockId, new Map())
    }
    complianceMap.get(c.stockId)!.set(c.screeningRuleId, c)
  }

  async function handleStatusChange(
    stock: Stock,
    rule: ScreeningRule,
    newStatus: ComplianceStatus
  ) {
    const existing = complianceMap.get(stock.id)?.get(rule.id)
    try {
      if (existing) {
        await updateComplianceStatus(existing.id, { status: newStatus })
      } else {
        await createComplianceOverride({
          stockId: stock.id,
          screeningRuleId: rule.id,
          status: newStatus,
          layer: "manual",
          source: "manual_override",
          validFrom: new Date().toISOString().split("T")[0],
        })
      }
      // Optimistic update
      setCompliance((prev) => {
        const updated = [...prev]
        const idx = updated.findIndex(
          (c) => c.stockId === stock.id && c.screeningRuleId === rule.id
        )
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], status: newStatus }
        } else {
          updated.push({
            id: "temp-" + Date.now(),
            stockId: stock.id,
            screeningRuleId: rule.id,
            status: newStatus,
            layer: "manual",
            source: "manual_override",
            notes: "",
            validFrom: new Date().toISOString().split("T")[0],
            validUntil: null,
            debtRatio: null,
            cashInterestRatio: null,
            receivablesRatio: null,
            nonPermissibleIncomeRatio: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as StockCompliance)
        }
        return updated
      })
      toast.success(`Updated ${stock.symbol} → ${STATUS_LABELS[newStatus]}`)
    } catch {
      toast.error("Failed to update compliance")
    }
  }

  async function handleRunScreening() {
    try {
      const stockIds = stocks.map((s) => s.id)
      const result = await runScreening(stockIds)
      toast.success(`Screened ${result.stocks} stocks × ${result.rules} rules`)
      fetchData()
    } catch {
      toast.error("Screening failed")
    }
  }

  const [screeningStockId, setScreeningStockId] = useState<string | null>(null)

  async function handleScreenStock(stock: Stock) {
    setScreeningStockId(stock.id)
    try {
      await runScreening([stock.id])
      toast.success(`Screened ${stock.symbol}`)
      // Refresh compliance for this stock
      const comp = await listComplianceForStocks([stock.id])
      setCompliance((prev) => {
        const filtered = prev.filter((c) => c.stockId !== stock.id)
        return [...filtered, ...comp]
      })
    } catch {
      toast.error(`Failed to screen ${stock.symbol}`)
    } finally {
      setScreeningStockId(null)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteStock(id)
      toast.success("Stock deleted")
      fetchData()
    } catch {
      toast.error("Failed to delete")
    }
  }

  function openCreate() {
    setEditingStock(null)
    setFormOpen(true)
  }

  function openEdit(stock: Stock) {
    setEditingStock(stock)
    setFormOpen(true)
  }

  const startIdx = (page - 1) * limit + 1
  const endIdx = Math.min(page * limit, total)

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative min-w-[200px] max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-md border border-input bg-background px-2.5 text-sm"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        >
          <option value="">All Exchanges</option>
          {exchangeLookups.map((l) => (
            <option key={l.value} value={l.value}>
              {l.value}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-background px-2.5 text-sm"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="">All Sectors</option>
          {sectorLookups.map((l) => (
            <option key={l.id} value={l.label}>
              {l.label}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleRunScreening}>
            <IconShieldCheck className="mr-2 h-4 w-4" />
            Run Screening
          </Button>
          <Button variant="outline" onClick={() => setCsvOpen(true)}>
            <IconUpload className="mr-2 h-4 w-4" />
            CSV Import
          </Button>
          <Button onClick={openCreate}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Symbol</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Exchange</th>
              <th className="px-4 py-3 text-left font-medium">Sector</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && stocks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && stocks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {debouncedSearch ? `No stocks matching "${debouncedSearch}"` : "No stocks yet."}
                </td>
              </tr>
            )}
            {stocks.map((stock) => {
              const stockCompliance = complianceMap.get(stock.id)
              return (
                <tr key={stock.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-bold">
                      {stock.symbol}
                    </code>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {stock.countryCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                    {stock.name}
                  </td>
                  <td className="px-4 py-3 text-xs">{stock.exchange}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">
                    {stock.sector || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">
                    {stock.lastPrice != null ? stock.lastPrice.toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {/* Compliance cards inline */}
                    <div className="flex gap-1.5 flex-wrap">
                      {enabledRules.map((rule) => {
                        const comp = stockCompliance?.get(rule.id)
                        const status = (comp?.status ?? "not_screened") as string
                        return (
                          <ComplianceChip
                            key={rule.id}
                            ruleName={rule.name}
                            status={status}
                            onStatusChange={(s) =>
                              handleStatusChange(stock, rule, s)
                            }
                          />
                        )
                      })}
                      {enabledRules.length === 0 && (
                        <span className="text-xs text-muted-foreground">No rules</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Screen this stock"
                      onClick={() => handleScreenStock(stock)}
                      disabled={screeningStockId === stock.id}
                      className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted disabled:opacity-50"
                    >
                      <IconShieldCheck className={`h-4 w-4 ${screeningStockId === stock.id ? "animate-spin" : ""}`} />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted">
                        <IconDots className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(stock)}>
                          <IconPencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(stock.id)}
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
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

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {startIdx}–{endIdx} of {total} stocks
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stock Form Sheet */}
      <StockForm
        open={formOpen}
        onOpenChange={setFormOpen}
        stock={editingStock}
        exchangeLookups={exchangeLookups}
        onSaved={fetchData}
      />

      {/* CSV Import Sheet */}
      <CsvImport
        open={csvOpen}
        onOpenChange={setCsvOpen}
        onImported={fetchData}
      />
    </>
  )
}

/** Small color-coded compliance chip with inline status dropdown */
function ComplianceChip({
  ruleName,
  status,
  onStatusChange,
}: {
  ruleName: string
  status: string
  onStatusChange: (status: ComplianceStatus) => void
}) {
  const colorClass = STATUS_COLORS[status] ?? STATUS_COLORS.not_screened

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium cursor-pointer transition-colors hover:opacity-80 ${colorClass}`}
      >
        <span className="max-w-[80px] truncate">{ruleName}</span>
        <span className="opacity-60">▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {ALL_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange(s)}
            className={status === s ? "font-bold" : ""}
          >
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${
                s === "compliant"
                  ? "bg-green-500"
                  : s === "non_compliant"
                    ? "bg-red-500"
                    : s === "doubtful"
                      ? "bg-amber-500"
                      : "bg-gray-400"
              }`}
            />
            {STATUS_LABELS[s]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
