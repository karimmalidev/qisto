import { eq } from "drizzle-orm";
import type { DB } from "../../db/index.ts";
import {
  customers,
  installmentContracts,
  installmentSchedules,
} from "../../db/schema.ts";
import { ForbiddenError, type InstallmentSchedule } from "@qisto/schemas";

export class InstallmentScheduleService {
  constructor(private readonly db: DB) {}

  upsert = async (input: {
    userId: string;
    resourceId: string;
    payload: InstallmentSchedule;
  }) => {
    const found = (
      await this.db
        .select()
        .from(installmentSchedules)
        .innerJoin(
          installmentContracts,
          eq(installmentContracts.id, installmentSchedules.contractId),
        )
        .innerJoin(customers, eq(customers.id, installmentContracts.customerId))
        .where(eq(installmentContracts.id, input.resourceId))
        .limit(1)
    ).at(0);
    if (found && found.customers.userId != input.userId) {
      throw new ForbiddenError();
    }

    if (!found) {
      await this.db.insert(installmentSchedules).values({
        ...input.payload,
        id: input.resourceId,
      });
    } else if (
      found.installmentSchedules.updatedAt.getTime() <
      input.payload.updatedAt.getTime()
    ) {
      await this.db
        .update(installmentSchedules)
        .set({ ...input.payload })
        .where(eq(installmentSchedules.id, input.resourceId));
    }
  };
}
