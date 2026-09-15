import z from "zod";

export const installmentScheduleSchema = z.object({
  contractId: z.uuid(),
  completed: z.boolean(),
  dueDate: z.coerce.date(),
  amountDueCents: z.int().positive(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type InstallmentSchedule = z.infer<typeof installmentScheduleSchema>;
