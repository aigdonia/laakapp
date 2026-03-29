"use client"

import { useState } from "react"
import type { DataSource } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deleteDataSource } from "./actions"
import { DataSourceForm } from "./data-source-form"
import { toast } from "sonner"

export function DataSourcesTable({ dataSources }: { dataSources: DataSource[] }) {
  const [editing, setEditing] = useState<DataSource | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(item: DataSource) {
    try {
      await deleteDataSource(item.id)
      toast.success(`Deleted ${item.name}`)
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Source
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Name</th>
              <th className="px-4 py-3 text-start font-medium">Slug</th>
              <th className="px-4 py-3 text-start font-medium">Type</th>
              <th className="px-4 py-3 text-start font-medium">Countries</th>
              <th className="px-4 py-3 text-start font-medium">Rate Limit</th>
              <th className="px-4 py-3 text-start font-medium">Last Run</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSources.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No data sources yet. Add your first source.
                </td>
              </tr>
            )}
            {dataSources.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">
                  <button type="button" className="hover:underline text-start" onClick={() => setEditing(item)}>
                    {item.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.slug}</td>
                <td className="px-4 py-3 text-muted-foreground capitalize">
                  {item.type.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.countryCodes.join(", ")}
                </td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                  {item.rateLimitMs}ms
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.lastRunAt
                    ? new Date(item.lastRunAt).toLocaleDateString()
                    : "Never"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={item.enabled ? "success" : "secondary"}>
                    {item.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-xs" />}
                    >
                      <IconDots className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(item)}>
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(item)}
                      >
                        <IconTrash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataSourceForm
        open={showCreate}
        onOpenChange={setShowCreate}
      />

      <DataSourceForm
        key={editing?.id}
        open={!!editing}
        onOpenChange={(open) => { if (!open) setEditing(null) }}
        dataSource={editing ?? undefined}
      />
    </>
  )
}
