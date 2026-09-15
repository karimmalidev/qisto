"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  BoxIcon,
  CalendarPlusIcon,
  CalendarSearchIcon,
  ChevronsUpDownIcon,
  CoinsIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { ApiClient } from "@/api-client"
import { toast } from "sonner"

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

export function SidebarHeaderMenu() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const logoutMutation = useMutation({
    mutationFn: ApiClient.logout,
    onSuccess: () => navigate("/login", { replace: true }),
    onError: () => toast.error("فشل تسجيل الخروج"),
  })

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <img src="/qisto.svg" className="size-8 rounded-sm" />
              <div className="grid flex-1 text-sm leading-tight">
                <span className="truncate font-bold">قسطو</span>
                <span className="truncate text-xs opacity-80">
                  ادارة الاقساط
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              variant="destructive"
              className="cursor-pointer"
            >
              <LogOutIcon />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function SidebarFooterMenu() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="text-xs text-muted-foreground">
        الاصدار الاول (نسخة تجريبية)
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function SidebarMain() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>الوصول السريع</SidebarGroupLabel>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <Link to="/customers">
              <SidebarMenuButton variant="primary">
                <CalendarPlusIcon />
                <span>تقسيط</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/customers">
              <SidebarMenuButton variant="primary">
                <CoinsIcon />
                <span>تحصيل</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>الاقساط</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <SidebarMenuButton>
                <LayoutDashboardIcon />
                <span>الصفحة الرئيسية</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/installments">
              <SidebarMenuButton>
                <CalendarSearchIcon />
                <span>البحث في الاقساط</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>قاعدة البيانات</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/customers">
              <SidebarMenuButton>
                <UsersIcon />
                <span>ادارة العملاء</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to="/products">
              <SidebarMenuButton>
                <BoxIcon />
                <span>ادارة الصنف</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
