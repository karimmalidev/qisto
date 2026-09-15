import z from "zod";

export const customerSchema = z.object({
  name: z.string(),
  phone: z.string().nullable(),
  secondPhone: z.string().nullable(),
  nationalId: z.string().nullable(),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type Customer = z.infer<typeof customerSchema>;
