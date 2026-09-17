import { PageContainer } from "@/components/page-container"
import { ItemGroup } from "@/components/ui/item"
import { CustomerItem } from "./components/customer-item"
import { Button } from "@/components/ui/button"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AppContainer } from "@/app-container"
import { Spinner } from "@/components/ui/spinner"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { CreateCustomerDialog } from "./components/dialogs/create-customer-dialog"

export function CustomersPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState("")
  const query = useQuery({
    queryKey: ["customers", { search }],
    queryFn: async () =>
      await AppContainer.getInstance().customerService.findMany({
        search,
      }),
  })

  return (
    <>
      <PageContainer title="ادارة العملاء">
        <div className="mb-4 flex items-center gap-4 py-4 not-lg:grid">
          <InputGroup className="flex-4">
            <InputGroupInput
              placeholder="بحث في العملاء..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {query.data ? `${query.data.length} عميل` : `جاري البحث`}
            </InputGroupAddon>
          </InputGroup>

          <Separator orientation="vertical" className="not-lg:hidden" />

          <Button onClick={() => setCreateOpen(true)} className="flex-1">
            <PlusIcon /> اضافة عميل
          </Button>
        </div>
        <ItemGroup className="grid grid-cols-1">
          {!query.data && <Spinner />}
          {query.data?.map((customer) => (
            <CustomerItem key={customer.id} customer={customer} />
          ))}
        </ItemGroup>
      </PageContainer>

      <CreateCustomerDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
