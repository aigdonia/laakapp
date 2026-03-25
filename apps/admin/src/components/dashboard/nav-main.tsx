"use client"

import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconExternalLink } from "@tabler/icons-react"
import type { NavGroup } from "@/config/sidebar"

function isExternal(url: string) {
  return url.startsWith("http://") || url.startsWith("https://")
}

function isPlaceholder(url: string) {
  return url === "#"
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  return (
    <>
      {groups.map((group, i) => (
        <SidebarGroup key={group.label ?? i}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu>
            {group.items.map((item) => {
              const disabled = isPlaceholder(item.url)
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={disabled ? "pointer-events-none opacity-50" : ""}
                    {...(!disabled && {
                      render: isExternal(item.url) ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ) : (
                        <Link href={item.url} />
                      ),
                    })}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {isExternal(item.url) && (
                      <IconExternalLink className="ml-auto size-4 text-muted-foreground" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
