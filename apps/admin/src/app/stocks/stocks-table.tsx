"use client"

import { useState } from "react"
import type { Stock, Language } from "@fin-ai/shared"
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
import { deleteStock } from "./actions"
import { StockForm } from "./stock-form"
import { toast } from "sonner"

export function StocksTable({ stocks, languages }: { stocks: Stock[]; languages: Language[] }) {
  const [editingStock, setEditingStock] = useState<Stock | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(stock: Stock) {
    try {
      await deleteStock(stock.id)
      toast.success(`Deleted ${stock.symbol}`)
    } catch {
      toast.error("Failed to delete stock")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Stock
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Name</th>
              <th className="px-4 py-3 text-start font-medium">Symbol</th>
              <th className="px-4 py-3 text-start font-medium">Country</th>
              <th className="px-4 py-3 text-start font-medium">Exchange</th>
              <th className="px-4 py-3 text-start font-medium">Sector</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No stocks yet. Add your first stock.
                </td>
              </tr>
            )}
            {stocks.map((stock) => (
              <tr key={stock.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{stock.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {stock.symbol}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {stock.countryCode}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {stock.exchange}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {stock.sector}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={stock.enabled ? "success" : "secondary"}>
                    {stock.enabled ? "Enabled" : "Disabled"}
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
                        onClick={() => setEditingStock(stock)}
                      >
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(stock)}
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

      <StockForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
      />

      <StockForm
        key={editingStock?.id}
        open={!!editingStock}
        onOpenChange={(open) => {
          if (!open) setEditingStock(null)
        }}
        stock={editingStock ?? undefined}
        languages={languages}
      />
    </>
  )
}
