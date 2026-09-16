import { SunIcon, MoonIcon, MonitorCogIcon } from "lucide-react"
import { useTheme } from "../theme-provider"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

export function SidebarFooterMenu() {
  return (
    <SidebarMenu>
      <ModeToggle />
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          الاصدار الاول (نسخة تجريبية)
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            مظهر التطبيق
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          onClick={() => setTheme("light")}
          checked={theme == "light"}
        >
          <SunIcon />
          الوضع النهاري
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          onClick={() => setTheme("dark")}
          checked={theme == "dark"}
        >
          <MoonIcon />
          الوضع الليلي
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          onClick={() => setTheme("system")}
          checked={theme == "system"}
        >
          <MonitorCogIcon />
          حسب النظام
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
