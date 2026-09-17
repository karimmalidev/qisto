import { PageContainer } from "@/components/page-container"
import { ItemGroup } from "@/components/ui/item"
import { ProductItem } from "./components/product-item"
import { Button } from "@/components/ui/button"
import { PlusIcon, SearchIcon } from "lucide-react"
import { CreateProductDialog } from "./components/dialogs/create-product-dialog"
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
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
} from "@/components/ui/select"
import { ProductService } from "@/features/resources/product/product.service"

const ORDER_BY_OPTIONS: Record<
  keyof typeof ProductService.PRODUCTS_ORDER_BY_KV,
  string
> = {
  "name-asc": "الاسم",
  "price-desc": "السعر الأعلى",
  "price-asc": "السعر الأقل",
}

export function ProductsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [orderBy, setOrderBy] =
    useState<keyof typeof ProductService.PRODUCTS_ORDER_BY_KV>("name-asc")
  const query = useQuery({
    queryKey: ["products", { search, orderBy }],
    queryFn: async () =>
      await AppContainer.getInstance().productService.findMany({
        search,
        orderBy,
      }),
  })

  return (
    <>
      <PageContainer title="ادارة الاصناف">
        <div className="mb-4 flex items-center gap-4 py-4 not-lg:grid not-lg:grid-cols-2">
          <InputGroup className="col-span-2 flex-4">
            <InputGroupInput
              placeholder="بحث في الاصناف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {query.data ? `${query.data.length} صنف` : `جاري البحث`}
            </InputGroupAddon>
          </InputGroup>

          <Separator orientation="vertical" className="not-lg:hidden" />

          <Select value={orderBy} onValueChange={(v) => setOrderBy(v as any)}>
            <SelectTrigger className="w-full flex-1">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>ترتيب حسب</SelectLabel>
                {Object.entries(ORDER_BY_OPTIONS).map(([name, title]) => (
                  <SelectItem key={name} value={name}>
                    {title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="not-lg:hidden" />

          <Button onClick={() => setCreateOpen(true)} className="flex-1">
            <PlusIcon /> اضافة صنف
          </Button>
        </div>
        <ItemGroup className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
          {!query.data && <Spinner />}
          {query.data?.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </ItemGroup>
      </PageContainer>

      <CreateProductDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
