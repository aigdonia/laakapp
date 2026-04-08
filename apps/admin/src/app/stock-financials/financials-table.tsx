"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { StockFinancial, Stock } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconTrash } from "@tabler/icons-react"
import { deleteStockFinancial } from "./actions"
import { toast } from "sonner"

function formatNum(n: number | null): string {
  if (n == null) return "—"
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(2)
}

export function FinancialsTable({
  financials,
  stocks,
}: {
  financials: StockFinancial[]
  stocks: Stock[]
}) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const stockById = Object.fromEntries(stocks.map((s) => [s.id, s]))

  const filtered = search
    ? financials.filter((f) => {
        const stock = stockById[f.stockId]
        return stock?.symbol.toLowerCase().includes(search.toLowerCase())
      })
    : financials

  async function handleDelete(item: StockFinancial) {
    try {
      await deleteStockFinancial(item.id)
      router.refresh()
      toast.success("Deleted financial record")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-64 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Symbol</th>
              <th className="px-4 py-3 text-start font-medium">Year</th>
              <th className="px-4 py-3 text-start font-medium">Period</th>
              <th className="px-4 py-3 text-start font-medium">Source</th>
              <th className="px-4 py-3 text-end font-medium">Total Assets</th>
              <th className="px-4 py-3 text-end font-medium">Total Debt</th>
              <th className="px-4 py-3 text-end font-medium">Market Cap</th>
              <th className="px-4 py-3 text-start font-medium">Fetched</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "No matching records." : "No financial data yet. Run a scrape job to populate."}
                </td>
              </tr>
            )}
            {filtered.map((item) => {
              const stock = stockById[item.stockId]
              return (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">
                    {stock?.symbol ?? "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">
                    {item.fiscalYear}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground uppercase">
                    {item.fiscalPeriod}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{item.source}</Badge>
                  </td>
                  <td className="px-4 py-3 text-end text-muted-foreground tabular-nums">
                    {formatNum(item.totalAssets)}
                  </td>
                  <td className="px-4 py-3 text-end text-muted-foreground tabular-nums">
                    {formatNum(item.totalDebt)}
                  </td>
                  <td className="px-4 py-3 text-end text-muted-foreground tabular-nums">
                    {formatNum(item.marketCap)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(item.fetchedAt).toLocaleDateString()}
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
    </>
  )
}
