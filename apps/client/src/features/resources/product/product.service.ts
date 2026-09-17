import { type DB } from "@/db"
import { products } from "@/db/schema"
import { and, asc, desc, eq, isNull, like } from "drizzle-orm"

export class ProductService {
  static PRODUCTS_ORDER_BY_KV = {
    "price-desc": desc(products.priceCents),
    "price-asc": asc(products.priceCents),
    "name-asc": asc(products.name),
  } as const

  constructor(private readonly db: DB) {}

  create = async (input: typeof products.$inferInsert) => {
    return this.db.insert(products).values(input).returning()
  }

  update = async (
    input: Partial<typeof products.$inferInsert> & { id: string }
  ) => {
    return await this.db
      .update(products)
      .set(input)
      .where(eq(products.id, input.id))
      .returning()
  }

  findMany = async (input: {
    search?: string
    orderBy?: keyof typeof ProductService.PRODUCTS_ORDER_BY_KV
  }) => {
    const search = input.search?.trim()

    return this.db.query.products.findMany({
      where: search
        ? and(isNull(products.deletedAt), like(products.name, `%${search}%`))
        : isNull(products.deletedAt),
      orderBy: ProductService.PRODUCTS_ORDER_BY_KV[input.orderBy ?? "name-asc"],
    })
  }
}
