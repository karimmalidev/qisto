import z from "zod";
import { operationSchema } from "../resources/operation.schema.ts";

export const syncPushSchema = z.object({
  request: z.object({
    body: z.array(operationSchema),
  }),
});

export const syncPullSchema = z.object({
  response: z.object({
    body: z.array(operationSchema),
  }),
});

export type SyncPush = z.infer<typeof syncPushSchema>;
export type SyncPull = z.infer<typeof syncPullSchema>;
