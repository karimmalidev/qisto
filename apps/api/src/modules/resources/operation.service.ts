import {
  InternalServerError,
  NotFoundError,
  type Operation,
} from "@qisto/schemas";
import type { DB } from "../../db/index.ts";
import { operations, sessions } from "../../db/schema.ts";
import { ProductService } from "./product.service.ts";
import { CustomerService } from "./customer.service.ts";
import { InstallmentContractService } from "./installment-contract.service.ts";
import { InstallmentScheduleService } from "./installment-schedule.service.ts";
import { PaymentAllocationService } from "./payment-allocation.service.ts";
import { PaymentService } from "./payment.service.ts";
import { eq } from "drizzle-orm";

export class OperationService {
  constructor(private readonly db: DB) {}

  push = async (
    input: Operation & {
      userId: string;
      sessionId: string;
    },
  ) => {
    await this.db.transaction(async (tx) => {
      const found = await tx.query.operations.findFirst({
        where: { id: input.id },
      });
      if (found) return;

      await tx.insert(operations).values(input);

      if (input.method == "UPSERT") {
        await new OperationService.RESOURCE_TYPE_SERVICE_KV[input.resourceType](
          tx as any,
        ).upsert(input as any);
      } else {
        throw new InternalServerError("Method not implemented");
      }
    });
  };

  pull = async (input: {
    userId: string;
    sessionId: string;
  }): Promise<Operation[]> => {
    const session = await this.db.query.sessions.findFirst({
      where: { id: input.sessionId },
    });

    if (!session) throw new NotFoundError("Session not found");

    const operations = await this.db.query.operations.findMany({
      where: {
        userId: input.userId,
        ...(session.lastSyncedOperationId == null
          ? {}
          : { id: { gt: session.lastSyncedOperationId } }),
      },
      orderBy: { id: "asc" },
    });

    if (operations.length > 0) {
      await this.db
        .update(sessions)
        .set({ lastSyncedOperationId: operations.at(-1)?.id ?? null })
        .where(eq(sessions.id, input.sessionId));
    }

    return operations.map(
      ({ id, method, payload, resourceId, resourceType }) => ({
        id,
        method,
        resourceId,
        resourceType,
        payload: payload as any,
      }),
    );
  };

  private static RESOURCE_TYPE_SERVICE_KV = {
    CUSTOMER: CustomerService,
    PRODUCT: ProductService,
    INSTALLMENT_CONTRACT: InstallmentContractService,
    INSTALLMENT_SCHEDULE: InstallmentScheduleService,
    PAYMENT_ALLOCATION: PaymentAllocationService,
    PAYMENT: PaymentService,
  } as const;
}
