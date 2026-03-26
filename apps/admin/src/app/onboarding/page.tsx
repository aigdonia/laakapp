import { PageLayout } from "@/components/page-layout"
import { listOnboardingScreens } from "./actions"
import { listLanguages } from "@/app/languages/actions"
import { OnboardingTable } from "./onboarding-table"

export default async function OnboardingPage() {
  const [screens, languages] = await Promise.all([
    listOnboardingScreens(),
    listLanguages(),
  ])

  return (
    <PageLayout
      title="Onboarding"
      description="Configure the screens users see when they first open the app."
    >
      <OnboardingTable screens={screens} languages={languages} />
    </PageLayout>
  )
}
