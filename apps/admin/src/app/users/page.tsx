import { PageLayout } from "@/components/page-layout"
import { listUsers } from "./actions"
import { UsersTable } from "./users-table"

export default async function UsersPage() {
  const users = await listUsers()

  return (
    <PageLayout
      title="Users"
      description={`${users.length} users tracked across activity, credits, and devices.`}
    >
      <UsersTable users={users} />
    </PageLayout>
  )
}
