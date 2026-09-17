import { AppContainer } from "@/app-container"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import type { customers } from "@/db/schema"
import { CustomerItemDescription } from "@/pages/customers/components/customer-item-description"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export function CustomersCombobox({
  customer,
  setCustomer,
}: {
  customer: typeof customers.$inferSelect | null
  setCustomer: (customer: typeof customers.$inferSelect | null) => void
}) {
  const [search, setSearch] = useState("")
  const query = useQuery({
    queryKey: ["customers", { search }],
    queryFn: async () =>
      await AppContainer.getInstance().customerService.findMany({
        search,
      }),
  })

  return (
    <Combobox
      items={query.data}
      itemToStringValue={(customer: typeof customers.$inferSelect) =>
        customer.name
      }
      value={customer}
      onValueChange={setCustomer}
    >
      <ComboboxInput
        placeholder="بحث في العملاء..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ComboboxContent>
        <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
        <ComboboxList>
          {(customer: typeof customers.$inferSelect) => (
            <ComboboxItem key={customer.id} value={customer}>
              <Item size="xs" className="p-0">
                <ItemContent>
                  <ItemTitle className="whitespace-nowrap">
                    {customer.name}
                  </ItemTitle>
                  <CustomerItemDescription customer={customer} />
                </ItemContent>
              </Item>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
