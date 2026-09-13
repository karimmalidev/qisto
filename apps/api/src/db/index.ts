import "dotenv/config";
import { defineRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";

export const db = drizzle(process.env.DATABASE_URL!, {
  relations: defineRelations(schema),
});

export type DB = typeof db;
