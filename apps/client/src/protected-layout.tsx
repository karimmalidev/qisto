import { Outlet } from "react-router"
import { AppSidebar } from "./components/app-sidebar"
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar"

export function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
