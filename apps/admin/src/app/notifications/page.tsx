import { PageLayout } from "@/components/page-layout"
import { listNotifications } from "./actions"
import { NotificationsTable } from "./notifications-table"

export default async function NotificationsPage() {
  const notifications = await listNotifications()

  return (
    <PageLayout
      title="Notifications"
      description="Manage push notification campaigns for your users."
    >
      <NotificationsTable notifications={notifications} />
    </PageLayout>
  )
}
