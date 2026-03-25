import { PageLayout } from "@/components/page-layout"
import { listStocks } from "./actions"
import { listLanguages } from "../languages/actions"
import { StocksTable } from "./stocks-table"

export default async function StocksPage() {
  const [stocks, languages] = await Promise.all([
    listStocks(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Stocks"
      description="Manage stocks and their Sharia screening status."
    >
      <StocksTable stocks={stocks} languages={languages} />
    </PageLayout>
  )
}
