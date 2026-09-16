import z from "zod";

export const PAYMENT_TYPES = ["INSTALLMENT", "DOWN_PAYMENT"] as const;

export const PAYMENT_METHODS = [
  "CASH",
  "DIGITAL_WALLET",
  "BANK_TRANSFER",
  "CHEQUE",
  "OTHER",
] as const;

export type PaymentType = (typeof PAYMENT_TYPES)[number];

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const paymentSchema = z.object({
  customerId: z.uuid(),
  amountPaidCents: z.int().positive(),
  method: z.enum(PAYMENT_METHODS),
  type: z.enum(PAYMENT_TYPES),
  paidAt: z.coerce.date().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type Payment = z.infer<typeof paymentSchema>;
