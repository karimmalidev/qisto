import { eq } from "drizzle-orm";
import type { DB } from "../../db/index.ts";
import { customers, installmentContracts } from "../../db/schema.ts";
import { ForbiddenError, type InstallmentContract } from "@qisto/schemas";

export class InstallmentContractService {
  constructor(private readonly db: DB) {}

  upsert = async (input: {
    userId: string;
    resourceId: string;
    payload: InstallmentContract;
  }) => {
    const found = (
      await this.db
        .select()
        .from(installmentContracts)
        .innerJoin(customers, eq(customers.id, installmentContracts.customerId))
        .where(eq(installmentContracts.id, input.resourceId))
        .limit(1)
    ).at(0);
    if (found && found.customers.userId != input.userId) {
      throw new ForbiddenError();
    }

    if (!found) {
      await this.db.insert(installmentContracts).values({
        ...input.payload,
        id: input.resourceId,
      });
    } else if (
      found.installmentContracts.updatedAt.getTime() <
      input.payload.updatedAt.getTime()
    ) {
      await this.db
        .update(installmentContracts)
        .set({ ...input.payload })
        .where(eq(installmentContracts.id, input.resourceId));
    }
  };
}
