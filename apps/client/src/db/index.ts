import { drizzle, SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy"
import Database from "@tauri-apps/plugin-sql"
import * as schema from "./schema"

// Import all generated SQL migration files dynamically in order
const migrationFiles = import.meta.glob("./migrations/*/*.sql", {
  query: "?raw",
  import: "default",
  eager: true,
})

export type DB = SqliteRemoteDatabase<typeof schema>

async function initDb(): Promise<DB> {
  const sqlite = await Database.load("sqlite:qisto.db")

  // 1. Ensure migrations tracking table exists
  await sqlite.execute(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `)

  // 2. Fetch already executed migration hashes
  const appliedRows = await sqlite.select<{ hash: string }[]>(
    "SELECT hash FROM __drizzle_migrations;"
  )
  const appliedHashes = new Set(appliedRows.map((r) => r.hash))

  // 3. Run only pending migrations
  const sortedPaths = Object.keys(migrationFiles).sort()
  for (const path of sortedPaths) {
    const filename = path.split("/").pop() || path

    if (!appliedHashes.has(filename)) {
      const sqlContent = migrationFiles[path] as string

      // SQLite driver might require individual statements split by semicolon
      const statements = sqlContent
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      for (const statement of statements) {
        await sqlite.execute(statement)
      }

      // Record successful migration
      await sqlite.execute(
        "INSERT INTO __drizzle_migrations (hash, created_at) VALUES ($1, $2);",
        [filename, Date.now()]
      )
    }
  }

  // 4. Return Drizzle instance
  return drizzle(
    async (sql, params, method) => {
      try {
        if (method === "all" || method === "get") {
          const rows = await sqlite.select<Record<string, unknown>[]>(
            sql,
            params
          )
          const data = rows.map((row) => Object.values(row))
          return { rows: method === "get" ? data[0] : data }
        } else {
          await sqlite.execute(sql, params)
          return { rows: [] }
        }
      } catch (err) {
        console.error("DB Error:", err)
        return { rows: [] }
      }
    },
    { schema }
  )
}

let db: DB | undefined

export const getDb = async () => {
  if (!db) {
    db = await initDb()
  }
  return db
}
