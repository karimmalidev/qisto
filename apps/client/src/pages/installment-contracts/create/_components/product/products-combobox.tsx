import { AppContainer } from "@/app-container"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import type { products } from "@/db/schema"
import { formatCurrency } from "@/lib/format"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export function ProductsCombobox({
  product,
  setProduct,
}: {
  product: typeof products.$inferSelect | null
  setProduct: (product: typeof products.$inferSelect | null) => void
}) {
  const [search, setSearch] = useState("")
  const query = useQuery({
    queryKey: ["products", { search }],
    queryFn: async () =>
      await AppContainer.getInstance().productService.findMany({ search }),
  })

  return (
    <Combobox
      items={query.data}
      itemToStringValue={(product: typeof products.$inferSelect) =>
        product.name
      }
      value={product}
      onValueChange={setProduct}
    >
      <ComboboxInput
        placeholder="بحث في الاصناف..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ComboboxContent>
        <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
        <ComboboxList>
          {(product: typeof products.$inferSelect) => (
            <ComboboxItem key={product.id} value={product}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {product.name}
                  </ItemTitle>
                  <ItemDescription className="text-lg leading-snug font-medium text-foreground">
                    {formatCurrency(product.priceCents / 100)}
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
