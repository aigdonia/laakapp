"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { bulkUpsertStocks } from "./actions"
import { toast } from "sonner"

interface CsvRow {
  symbol: string
  name: string
  countryCode: string
  exchange: string
  sector: string
  lastPrice: string
  enabled: string
}

interface ParsedRow {
  symbol: string
  name: string
  countryCode: string
  exchange: string
  sector: string
  lastPrice: number | null
  enabled: boolean
  errors: string[]
}

function validateRow(raw: CsvRow, index: number): ParsedRow {
  const errors: string[] = []
  if (!raw.symbol?.trim()) errors.push("symbol is required")
  if (!raw.name?.trim()) errors.push("name is required")
  if (!raw.countryCode?.trim()) errors.push("countryCode is required")
  if (!raw.exchange?.trim()) errors.push("exchange is required")

  let lastPrice: number | null = null
  if (raw.lastPrice?.trim()) {
    const parsed = Number(raw.lastPrice)
    if (Number.isNaN(parsed)) errors.push("lastPrice must be a number")
    else lastPrice = parsed
  }

  const enabledStr = (raw.enabled ?? "").trim().toLowerCase()
  const enabled = enabledStr === "" || enabledStr === "true" || enabledStr === "1"

  return {
    symbol: (raw.symbol ?? "").trim().toUpperCase(),
    name: (raw.name ?? "").trim(),
    countryCode: (raw.countryCode ?? "").trim().toUpperCase(),
    exchange: (raw.exchange ?? "").trim(),
    sector: (raw.sector ?? "").trim(),
    lastPrice,
    enabled,
    errors,
  }
}

function downloadTemplate() {
  const csv = "symbol,name,countryCode,exchange,sector,lastPrice,enabled\nCOMI,Commercial International Bank,EG,EGX,Financial Services,52.30,true\n"
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "stocks-template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export function CsvImport({
  open,
  onOpenChange,
  onImported,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImported?: () => void
}) {
  const router = useRouter()
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        setRows(results.data.map((row, i) => validateRow(row, i)))
      },
    })
  }, [])

  const validRows = rows.filter((r) => r.errors.length === 0)
  const errorRows = rows.filter((r) => r.errors.length > 0)

  async function handleImport() {
    if (validRows.length === 0) return
    setImporting(true)
    try {
      const payload = validRows.map(({ errors, ...rest }) => rest)
      const result = await bulkUpsertStocks(payload)
      toast.success(
        `Created ${result.created}, updated ${result.updated}${result.errors.length ? `, ${result.errors.length} errors` : ""}`
      )
      router.refresh()
      onImported?.()
      if (result.errors.length > 0) {
        result.errors.forEach((err) => toast.error(err))
      }
      setRows([])
      onOpenChange(false)
    } catch {
      toast.error("Import failed")
    } finally {
      setImporting(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) setRows([])
        onOpenChange(v)
      }}
    >
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Import Stocks from CSV</SheetTitle>
          <SheetDescription>
            Upload a CSV file with columns: symbol, name, countryCode, exchange,
            sector, lastPrice, enabled. Existing symbols will be updated.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              Download Template
            </Button>
          </div>

          {rows.length > 0 && (
            <>
              <div className="flex gap-3 text-sm">
                <span className="text-muted-foreground">
                  {rows.length} rows parsed
                </span>
                <Badge variant="success">{validRows.length} valid</Badge>
                {errorRows.length > 0 && (
                  <Badge variant="destructive">{errorRows.length} errors</Badge>
                )}
              </div>

              <div className="max-h-80 overflow-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50 text-muted-foreground">
                      <th className="px-2 py-1.5 text-start font-medium">Symbol</th>
                      <th className="px-2 py-1.5 text-start font-medium">Name</th>
                      <th className="px-2 py-1.5 text-start font-medium">Country</th>
                      <th className="px-2 py-1.5 text-start font-medium">Exchange</th>
                      <th className="px-2 py-1.5 text-start font-medium">Sector</th>
                      <th className="px-2 py-1.5 text-end font-medium">Price</th>
                      <th className="px-2 py-1.5 text-start font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b last:border-b-0 ${row.errors.length > 0 ? "bg-destructive/10" : ""}`}
                      >
                        <td className="px-2 py-1.5">{row.symbol}</td>
                        <td className="px-2 py-1.5">{row.name}</td>
                        <td className="px-2 py-1.5">{row.countryCode}</td>
                        <td className="px-2 py-1.5">{row.exchange}</td>
                        <td className="px-2 py-1.5">{row.sector}</td>
                        <td className="px-2 py-1.5 text-end">
                          {row.lastPrice != null ? row.lastPrice : "—"}
                        </td>
                        <td className="px-2 py-1.5">
                          {row.errors.length > 0 ? (
                            <span className="text-destructive">{row.errors.join(", ")}</span>
                          ) : (
                            <Badge variant="success" className="text-[10px]">OK</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          <Button
            onClick={handleImport}
            disabled={importing || validRows.length === 0}
          >
            {importing
              ? "Importing..."
              : `Import ${validRows.length} Stock${validRows.length !== 1 ? "s" : ""}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
