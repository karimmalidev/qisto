import { eq } from "drizzle-orm";
import type { DB } from "../../db/index.ts";
import { customers, paymentAllocations, payments } from "../../db/schema.ts";
import { ForbiddenError, type PaymentAllocation } from "@qisto/schemas";

export class PaymentAllocationService {
  constructor(private readonly db: DB) {}

  upsert = async (input: {
    userId: string;
    resourceId: string;
    payload: PaymentAllocation;
  }) => {
    const found = (
      await this.db
        .select()
        .from(paymentAllocations)
        .innerJoin(payments, eq(payments.id, paymentAllocations.paymentId))
        .innerJoin(customers, eq(customers.id, payments.customerId))
        .where(eq(paymentAllocations.id, input.resourceId))
        .limit(1)
    ).at(0);
    if (found && found.customers.userId != input.userId) {
      throw new ForbiddenError();
    }

    if (!found) {
      await this.db.insert(paymentAllocations).values({
        ...input.payload,
        id: input.resourceId,
      });
    } else if (
      found.paymentAllocations.updatedAt.getTime() <
      input.payload.updatedAt.getTime()
    ) {
      await this.db
        .update(paymentAllocations)
        .set({ ...input.payload })
        .where(eq(paymentAllocations.id, input.resourceId));
    }
  };
}
