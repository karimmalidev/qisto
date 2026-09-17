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
import type { products } from "@/db/schema"
import { formatCurrency } from "@/lib/format"
import { BoxIcon, EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { UpdateProductDialog } from "./dialogs/update-product-dialog"
import { cn } from "cn"
import { DeleteProductDialog } from "./dialogs/delete-product-dialog"

export function ProductItem({
  product,
}: {
  product: typeof products.$inferSelect
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
        <ItemMedia variant="icon">
          <BoxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{product.name}</ItemTitle>
          <ItemDescription className="text-lg leading-snug font-medium text-foreground">
            {formatCurrency(product.priceCents / 100)}
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
                  تغيير الاسم أو السعر
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <TrashIcon />
                  حذف الصنف
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      <UpdateProductDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        product={product}
      />
      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={product}
      />
    </>
  )
}
