"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarHeaderMenu } from "./sidebar-header-menu"
import { SidebarFooterMenu } from "./sidebar-footer-menu"
import { SidebarMain } from "./sidebar-main"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader>
        <SidebarHeaderMenu />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
