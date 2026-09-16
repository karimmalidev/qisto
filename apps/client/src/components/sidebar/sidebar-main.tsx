import {
  CalendarPlusIcon,
  CoinsIcon,
  LayoutDashboardIcon,
  CalendarSearchIcon,
  UsersIcon,
  BoxIcon,
} from "lucide-react"
import { Link } from "react-router"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar"

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
