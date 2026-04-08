"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AppSettings, ExchangeRate, Language } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { updateAppSettings } from "./actions"
import { toast } from "sonner"

const selectClass =
  "h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export function SettingsForm({
  settings,
  languages,
  exchangeRates,
}: {
  settings: AppSettings
  languages: Language[]
  exchangeRates: ExchangeRate[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const enabledCurrencies = exchangeRates.filter((r) => r.enabled)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const data = {
      maintenanceMode: form.get("maintenanceMode") === "on",
      defaultLanguage: form.get("defaultLanguage") as string,
      onboardingEnabled: form.get("onboardingEnabled") === "on",
      baseCurrency: form.get("baseCurrency") as string,
      minAppVersion: (form.get("minAppVersion") as string) || "0.0.0",
    }

    try {
      await updateAppSettings(data)
      router.refresh()
      toast.success("Settings updated")
    } catch {
      toast.error("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6"
    >
      <div className="rounded-lg border p-6 space-y-6">
        <div>
          <h3 className="text-base font-medium">General</h3>
          <p className="text-sm text-muted-foreground">
            Core application settings.
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, the app shows a maintenance page to all users.
            </p>
          </div>
          <Switch
            id="maintenanceMode"
            name="maintenanceMode"
            defaultChecked={settings.maintenanceMode}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="onboardingEnabled">Onboarding Flow</Label>
            <p className="text-sm text-muted-foreground">
              Show the onboarding wizard for new users.
            </p>
          </div>
          <Switch
            id="onboardingEnabled"
            name="onboardingEnabled"
            defaultChecked={settings.onboardingEnabled}
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label htmlFor="defaultLanguage">Default Language</Label>
          <select
            id="defaultLanguage"
            name="defaultLanguage"
            defaultValue={settings.defaultLanguage}
            className={selectClass}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            The default language for new users.
          </p>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label htmlFor="baseCurrency">Base Currency</Label>
          <select
            id="baseCurrency"
            name="baseCurrency"
            defaultValue={settings.baseCurrency}
            className={selectClass}
          >
            {enabledCurrencies.map((rate) => (
              <option key={rate.currency} value={rate.currency}>
                {rate.currency}{rate.ratePerUsd === 1 ? " (base)" : ""}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            The reference currency for exchange rate conversions. All rates are
            defined relative to this currency.
          </p>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <Label htmlFor="minAppVersion">Minimum App Version</Label>
          <Input
            id="minAppVersion"
            name="minAppVersion"
            defaultValue={settings.minAppVersion}
            placeholder="0.0.0"
            className="max-w-xs"
          />
          <p className="text-sm text-muted-foreground">
            Users on versions below this will see a force-update screen and
            cannot use the app. Use &quot;0.0.0&quot; to allow all versions.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
