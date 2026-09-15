import { type Operation } from "@qisto/schemas";
import type { OperationService } from "../resources/operation.service.ts";

export class SyncService {
  constructor(private readonly operationService: OperationService) {}

  push = async (input: {
    userId: string;
    sessionId: string;
    operations: Operation[];
  }) => {
    for (const operation of input.operations) {
      await this.operationService.push({
        userId: input.userId,
        sessionId: input.sessionId,
        ...operation,
      });
    }
  };

  pull = async (input: { userId: string; sessionId: string }) => {
    return await this.operationService.pull(input);
  };
}
