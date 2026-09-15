import type { Request, Response } from "express";
import type { SyncService } from "./sync.service.ts";
import { syncPushSchema, type SyncPush } from "@qisto/schemas";

export class SyncController {
  constructor(private readonly service: SyncService) {}

  push = async (req: Request, res: Response) => {
    const operations: SyncPush["request"]["body"] =
      syncPushSchema.shape.request.shape.body.parse(req.body);

    await this.service.push({
      operations,
      userId: req.userId,
      sessionId: req.sessionId,
    });

    return res.status(201).json({});
  };

  pull = async (req: Request, res: Response) => {
    return res.json(
      await this.service.pull({ userId: req.userId, sessionId: req.sessionId }),
    );
  };
}
