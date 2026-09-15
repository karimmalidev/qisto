import z from "zod";

export const paymentAllocationSchema = z.object({
  paymentId: z.uuid(),
  scheduleId: z.uuid(),
  amountCents: z.int().positive(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type PaymentAllocation = z.infer<typeof paymentAllocationSchema>;
