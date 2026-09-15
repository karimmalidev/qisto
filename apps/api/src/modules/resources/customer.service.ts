import { eq } from "drizzle-orm";
import type { DB } from "../../db/index.ts";
import { customers } from "../../db/schema.ts";
import { ForbiddenError, type Customer } from "@qisto/schemas";

export class CustomerService {
  constructor(private readonly db: DB) {}

  upsert = async (input: {
    userId: string;
    resourceId: string;
    payload: Customer;
  }) => {
    const found = await this.db.query.customers.findFirst({
      where: { id: input.resourceId },
    });
    if (found && found.userId != input.userId) {
      throw new ForbiddenError();
    }

    if (!found) {
      await this.db.insert(customers).values({
        ...input.payload,
        id: input.resourceId,
        userId: input.userId,
      });
    } else if (found.updatedAt.getTime() < input.payload.updatedAt.getTime()) {
      await this.db
        .update(customers)
        .set({ ...input.payload })
        .where(eq(customers.id, input.resourceId));
    }
  };
}
