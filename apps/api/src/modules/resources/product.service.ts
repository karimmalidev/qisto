import { eq } from "drizzle-orm";
import type { DB } from "../../db/index.ts";
import { products } from "../../db/schema.ts";
import { ForbiddenError, type Product } from "@qisto/schemas";

export class ProductService {
  constructor(private readonly db: DB) {}

  upsert = async (input: {
    userId: string;
    resourceId: string;
    payload: Product;
  }) => {
    const found = await this.db.query.products.findFirst({
      where: { id: input.resourceId },
    });
    if (found && found.userId != input.userId) {
      throw new ForbiddenError();
    }

    if (!found) {
      await this.db.insert(products).values({
        ...input.payload,
        id: input.resourceId,
        userId: input.userId,
      });
    } else if (found.updatedAt.getTime() < input.payload.updatedAt.getTime()) {
      await this.db
        .update(products)
        .set({ ...input.payload })
        .where(eq(products.id, input.resourceId));
    }
  };
}
