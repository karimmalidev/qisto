import z from "zod";

export const productSchema = z.object({
  name: z.string(),
  priceCents: z.int().positive(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export type Product = z.infer<typeof productSchema>;
