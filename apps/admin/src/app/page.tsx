import { PageLayout } from "@/components/page-layout"

export default function DashboardPage() {
  return (
    <PageLayout title="Dashboard" description="Overview of your workspace.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
          >
            <div className="text-sm font-medium text-muted-foreground">
              Metric {i + 1}
            </div>
            <div className="mt-2 text-2xl font-bold">--</div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
