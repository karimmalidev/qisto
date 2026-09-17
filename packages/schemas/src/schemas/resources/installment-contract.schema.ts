import z from "zod";

export const installmentContractSchema = z.object({
  customerId: z.uuid(),
  productId: z.uuid(),
  productNameSnapshot: z.string(),
  productPriceCentsSnapshot: z.int().positive(),
  discountCents: z.int().nonnegative(),
  downPaymentCents: z.int().nonnegative(),
  interestCents: z.int().nonnegative(),
  notes: z.string().nullable(),
  completed: z.boolean(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type InstallmentContract = z.infer<typeof installmentContractSchema>;
