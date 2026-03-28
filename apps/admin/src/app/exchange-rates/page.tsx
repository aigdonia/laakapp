import { PageLayout } from "@/components/page-layout"
import { listExchangeRates, listCurrencyLookups, getAppSettings } from "./actions"
import { ExchangeRatesTable } from "./exchange-rates-table"

export default async function ExchangeRatesPage() {
  const [rates, currencyLookups, settings] = await Promise.all([
    listExchangeRates(),
    listCurrencyLookups(),
    getAppSettings(),
  ])

  return (
    <PageLayout
      title="Currency Management"
      description="Exchange rates relative to the base currency. Currencies are defined in Lookups."
    >
      <ExchangeRatesTable
        rates={rates}
        currencyLookups={currencyLookups}
        baseCurrency={settings.baseCurrency}
      />
    </PageLayout>
  )
}
