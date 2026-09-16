import { ApiClient } from "@/api-client"
import { useMutation } from "@tanstack/react-query"
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "../ui/dropdown-menu"
import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar"

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
