"use client"

import * as React from "react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { sidebarConfig } from "@/config/sidebar"
import Link from "next/link"
import { LaakLogo } from "@/components/laak-logo"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <LaakLogo size={32} className="shrink-0 !size-8" />
              <span className="text-base font-semibold">Admin Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={sidebarConfig.nav} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger className="group-data-[state=expanded]:ml-auto" />
        <NavUser user={sidebarConfig.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
