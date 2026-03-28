import { PageLayout } from "@/components/page-layout"
import { getAppSettings } from "./actions"
import { listLanguages } from "../languages/actions"
import { listExchangeRates } from "../exchange-rates/actions"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const [settings, languages, exchangeRates] = await Promise.all([
    getAppSettings(),
    listLanguages(),
    listExchangeRates(),
  ])

  return (
    <PageLayout
      title="Settings"
      description="Global application configuration."
    >
      <SettingsForm
        settings={settings}
        languages={languages}
        exchangeRates={exchangeRates}
      />
    </PageLayout>
  )
}
