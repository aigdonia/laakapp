import { PageLayout } from "@/components/page-layout"
import { getAppSettings } from "./actions"
import { listLanguages } from "../languages/actions"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const [settings, languages] = await Promise.all([
    getAppSettings(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Settings"
      description="Global application configuration."
    >
      <SettingsForm settings={settings} languages={languages} />
    </PageLayout>
  )
}
