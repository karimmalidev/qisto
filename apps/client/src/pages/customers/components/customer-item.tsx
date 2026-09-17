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
  ItemDescription,
  ItemActions,
} from "@/components/ui/item"
import type { customers } from "@/db/schema"
import {
  EditIcon,
  IdCardIcon,
  MapPinIcon,
  MoreVerticalIcon,
  NotebookPenIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"
import { cn } from "cn"
import { UpdateCustomerDialog } from "./dialogs/update-customer-dialog"
import { DeleteCustomerDialog } from "./dialogs/delete-customer-dialog"
import { Badge } from "@/components/ui/badge"

export function CustomerItem({
  customer,
}: {
  customer: typeof customers.$inferSelect
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Item
        onClick={() => setDropdownOpen(true)}
        variant="outline"
        className={cn(
          "cursor-pointer hover:bg-muted",
          dropdownOpen && "bg-muted"
        )}
      >
        <ItemMedia variant="image">
          <UserIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{customer.name}</ItemTitle>
          <ItemDescription className="line-clamp-none flex flex-wrap gap-1">
            {(
              [
                ["phone", "هاتف", PhoneIcon],
                ["secondPhone", "هاتف ثانوي", PhoneIcon],
                ["nationalId", "رقم بطاقة", IdCardIcon],
                ["address", "العنوان", MapPinIcon],
                ["notes", "ملاحظات", NotebookPenIcon],
              ] as const
            ).map(
              ([key, title, Icon]) =>
                customer[key] && (
                  <Badge
                    variant="secondary"
                    className="h-auto max-w-full min-w-0 whitespace-normal"
                  >
                    <Icon />
                    <span className="font-normal">{title}:</span>
                    <span>{customer[key]}</span>
                  </Badge>
                )
            )}
          </ItemDescription>
        </ItemContent>
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
