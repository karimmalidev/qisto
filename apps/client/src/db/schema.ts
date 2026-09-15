import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { v7 } from "uuid"

export const users = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text().notNull(),
})
