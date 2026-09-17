import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import {
  ArrowLeftIcon,
  CoinsIcon,
  MoreVerticalIcon,
  UserIcon,
} from "lucide-react"

export function HomePage() {
  const today = new Date()

  return (
    <PageContainer title="الصفحة الرئيسية">
      <section className="grid h-full grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Due today */}
        <Card className="bg-cyan-800/5 ring-cyan-800/10 dark:bg-cyan-800/20 dark:ring-cyan-800/40">
          <CardHeader>
            <CardTitle>المستحق اليوم</CardTitle>
            <CardDescription>
              الأقساط التي يحين موعد سدادها اليوم
            </CardDescription>
            <CardAction>{formatDate(today)}</CardAction>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(dashboardStats.dueToday)}
            </p>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2">
            <Button size="xs" variant="outline">
              عرض تفاصيل الأقساط
            </Button>

            <Button size="xs" variant="outline">
              المستحق غدًا
              <ArrowLeftIcon />
            </Button>
          </CardFooter>
        </Card>

        {/* Overdue */}
        <Card className="bg-amber-800/5 ring-amber-800/10 dark:bg-amber-800/20 dark:ring-amber-800/40">
          <CardHeader>
            <CardTitle>المتأخر</CardTitle>
            <CardDescription>الأقساط التي تجاوزت موعد السداد</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold tracking-tight">
              {formatCurrency(dashboardStats.overdue)}
            </p>
          </CardContent>

          <CardFooter>
            <Button size="xs" variant="outline">
              عرض الأقساط المتأخرة
            </Button>
          </CardFooter>
        </Card>

        {/* Today's collections */}
        <Card className="xl:row-span-2">
          <CardHeader>
            <CardTitle>حصيلة اليوم</CardTitle>
            <CardDescription>
              إجمالي المبالغ التي تم تحصيلها اليوم
            </CardDescription>
            <CardAction>
              <Button size="xs">جميع المتحصلات</Button>
            </CardAction>
          </CardHeader>

          <CardContent className="grid gap-4">
            <ItemGroup className="grid grid-cols-2 gap-2">
              <Item className="bg-primary/5">
                <ItemContent>
                  <ItemTitle>إجمالي المبلغ</ItemTitle>
                  <ItemDescription className="text-lg font-bold text-foreground">
                    {formatCurrency(dashboardStats.todayTotal)}
                  </ItemDescription>
                </ItemContent>
              </Item>

              <Item className="bg-primary/5">
                <ItemContent>
                  <ItemTitle>عدد عمليات التحصيل</ItemTitle>
                  <ItemDescription className="text-lg font-bold text-foreground">
                    {formatNumber(dashboardStats.todayCollections)} عمليات
                  </ItemDescription>
                </ItemContent>
              </Item>

              <Item className="col-span-2 bg-primary/5">
                <ItemContent>
                  <ItemTitle>عمليات التحصيل</ItemTitle>

                  <ItemGroup className="max-h-[calc(100dvh-22rem)] overflow-y-auto py-2">
                    {collections.map((collection) => (
                      <CollectionItem
                        key={collection.id}
                        collection={collection}
                      />
                    ))}
                  </ItemGroup>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  )
}

function CollectionItem({ collection }: { collection: Collection }) {
  return (
    <Item className="bg-card dark:bg-primary/10" size="xs">
      <ItemContent>
        <ItemTitle>{formatCurrency(collection.amount)}</ItemTitle>
        <ItemDescription>من العميل: {collection.customer}</ItemDescription>
      </ItemContent>

      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="المزيد">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <UserIcon />
              تفاصيل العميل
            </DropdownMenuItem>

            <DropdownMenuItem>
              <CoinsIcon />
              تفاصيل عملية التحصيل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  )
}

type Collection = {
  id: number
  amount: number
  customer: string
}

const collections: Collection[] = [
  { id: 1, amount: 1200, customer: "فلان الفلاني" },
  { id: 2, amount: 450, customer: "أحمد محمد" },
  { id: 3, amount: 2042, customer: "محمد علي" },
  { id: 4, amount: 2340, customer: "محمود حسن" },
  { id: 5, amount: 324435, customer: "علي أحمد" },
  { id: 6, amount: 454, customer: "خالد محمود" },
  { id: 7, amount: 55344, customer: "حسن محمد" },
  { id: 8, amount: 423432, customer: "محمد حسن" },
  { id: 9, amount: 23423, customer: "أحمد علي" },
  { id: 10, amount: 4234, customer: "عمر خالد" },
  { id: 11, amount: 3243242234, customer: "إبراهيم محمد" },
  { id: 12, amount: 234, customer: "يوسف أحمد" },
]

const dashboardStats = {
  dueToday: 1230,
  overdue: 1230,
  todayTotal: 3400,
  todayCollections: 3,
}
