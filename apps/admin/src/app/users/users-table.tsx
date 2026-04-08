"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { IconNote } from "@tabler/icons-react"
import type { UserSummary } from "./actions"

function truncateId(id: string) {
  return id.slice(0, 8) + "…"
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "—"
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function UsersTable({ users }: { users: UserSummary[] }) {
  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No users found.
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-muted-foreground">
            <th className="px-4 py-3 text-start font-medium">User ID</th>
            <th className="px-4 py-3 text-start font-medium">Country</th>
            <th className="px-4 py-3 text-end font-medium">Devices</th>
            <th className="px-4 py-3 text-end font-medium">Events</th>
            <th className="px-4 py-3 text-end font-medium">Credits Spent</th>
            <th className="px-4 py-3 text-start font-medium">First Seen</th>
            <th className="px-4 py-3 text-start font-medium">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/users/${user.id}`}
                    className="font-mono text-xs text-blue-400 hover:underline"
                  >
                    {truncateId(user.id)}
                  </Link>
                  {user.notes && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help text-muted-foreground hover:text-foreground transition-colors">
                          <IconNote className="size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs whitespace-pre-wrap">
                          {user.notes}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {user.country ? (
                  <Badge variant="outline">{user.country}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-end tabular-nums">
                {user.devices > 0 ? (
                  <span>
                    {user.devices}{" "}
                    <span className="text-muted-foreground text-xs">
                      {user.platforms}
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-end tabular-nums">{user.events || "—"}</td>
              <td className="px-4 py-3 text-end tabular-nums">
                {user.creditsSpent > 0 ? user.creditsSpent : "—"}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {timeAgo(user.firstSeen)}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {timeAgo(user.lastActive)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
