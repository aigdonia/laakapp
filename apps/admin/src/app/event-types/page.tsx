import { PageLayout } from "@/components/page-layout"
import { listEventTypes } from "./actions"
import { EventTypesTable } from "./event-types-table"

export default async function EventTypesPage() {
  const eventTypes = await listEventTypes()

  return (
    <PageLayout
      title="Event Types"
      description="Registry of user events that can trigger activity rules."
    >
      <EventTypesTable eventTypes={eventTypes} />
    </PageLayout>
  )
}
