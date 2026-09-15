import { eq } from "drizzle-orm";
import type { DB } from "../../db/index.ts";
import { customers, payments } from "../../db/schema.ts";
import { ForbiddenError, type Payment } from "@qisto/schemas";

export class PaymentService {
  constructor(private readonly db: DB) {}

  upsert = async (input: {
    userId: string;
    resourceId: string;
    payload: Payment;
  }) => {
    const found = (
      await this.db
        .select()
        .from(payments)
        .innerJoin(customers, eq(customers.id, payments.customerId))
        .where(eq(payments.id, input.resourceId))
        .limit(1)
    ).at(0);
    if (found && found.customers.userId != input.userId) {
      throw new ForbiddenError();
    }

    if (!found) {
      await this.db.insert(payments).values({
        ...input.payload,
        id: input.resourceId,
      });
    } else if (
      found.payments.updatedAt.getTime() < input.payload.updatedAt.getTime()
    ) {
      await this.db
        .update(payments)
        .set({ ...input.payload })
        .where(eq(payments.id, input.resourceId));
    }
  };
}
