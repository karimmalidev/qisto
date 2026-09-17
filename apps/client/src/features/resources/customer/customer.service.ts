import { type DB } from "@/db"
import { customers } from "@/db/schema"
import { and, eq, isNull, like, or } from "drizzle-orm"

export class CustomerService {
  constructor(private readonly db: DB) {}

  create = async (input: typeof customers.$inferInsert) => {
    return this.db.insert(customers).values(input).returning()
  }

  update = async (
    input: Partial<typeof customers.$inferInsert> & { id: string }
  ) => {
    return await this.db
      .update(customers)
      .set(input)
      .where(eq(customers.id, input.id))
      .returning()
  }

  findMany = async (input: { search?: string }) => {
    const search = input.search?.trim()

    return this.db.query.customers.findMany({
      where: search
        ? and(
            isNull(customers.deletedAt),
            or(
              like(customers.name, `%${search}%`),
              like(customers.phone, `%${search}%`),
              like(customers.secondPhone, `%${search}%`),
              like(customers.nationalId, `%${search}%`),
              like(customers.address, `%${search}%`),
              like(customers.notes, `%${search}%`)
            )
          )
        : isNull(customers.deletedAt),
    })
  }
}
