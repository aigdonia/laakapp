import { PageLayout } from "@/components/page-layout"
import { listStockFinancials, listStocks } from "./actions"
import { FinancialsTable } from "./financials-table"

export default async function StockFinancialsPage() {
  const [financials, stocks] = await Promise.all([
    listStockFinancials(),
    listStocks(),
  ])

  return (
    <PageLayout
      title="Stock Financials"
      description="Browse raw balance sheet data scraped from various sources."
    >
      <FinancialsTable financials={financials} stocks={stocks} />
    </PageLayout>
  )
}
