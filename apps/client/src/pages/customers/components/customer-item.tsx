import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item"
import type { customers } from "@/db/schema"
import { EditIcon, MoreVerticalIcon, TrashIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "cn"
import { UpdateCustomerDialog } from "./dialogs/update-customer-dialog"
import { DeleteCustomerDialog } from "./dialogs/delete-customer-dialog"
import { CustomerItemDescription } from "./customer-item-description"

export function CustomerItem({
  customer,
  hideActions,
}: {
  customer: typeof customers.$inferSelect
  hideActions?: boolean
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Item
        onClick={hideActions ? undefined : () => setDropdownOpen(true)}
        variant="outline"
        className={cn(
          !hideActions && "cursor-pointer hover:bg-muted",
          !hideActions && dropdownOpen && "bg-muted"
        )}
      >
        <ItemMedia variant="image">
          <UserIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{customer.name}</ItemTitle>
          <CustomerItemDescription customer={customer} />
        </ItemContent>
        {!hideActions && (
          <ItemActions>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
                    <EditIcon />
                    تحديث البيانات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <TrashIcon />
                    حذف العميل
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ItemActions>
        )}
      </Item>

      <UpdateCustomerDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        customer={customer}
      />
      <DeleteCustomerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        customer={customer}
      />
    </>
  )
}
