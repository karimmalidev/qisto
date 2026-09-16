import type {
  OperationMethod,
  OperationResourceType,
  PaymentMethod,
  PaymentType,
} from "@qisto/schemas"
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { v7 } from "uuid"

export const sessions = sqliteTable("sessions", {
  id: integer().primaryKey().default(1),
  lastSyncedOperationId: text(),
})

export const operations = sqliteTable("operations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  resourceType: text().$type<OperationResourceType[number]>().notNull(),
  resourceId: text().notNull(),
  method: text().$type<OperationMethod>().notNull(),
  payload: text(),
})

export const customers = sqliteTable("customers", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text().notNull(),
  phone: text(),
  secondPhone: text(),
  nationalId: text(),
  address: text(),
  notes: text(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp_ms" }),
})

export const products = sqliteTable("products", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text().notNull(),
  priceCents: integer().notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp_ms" }),
})

export const installmentContracts = sqliteTable("installmentContracts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  customerId: text()
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  productId: text()
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  productNameSnapshot: text().notNull(),
  productPriceCentsSnapshot: integer().notNull(),
  discountCents: integer().notNull(),
  downPaymentCents: integer().notNull(),
  interestRatePercent: real().notNull(),
  notes: text(),
  completed: integer({ mode: "boolean" }).notNull().default(false),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp_ms" }),
})

export const installmentSchedules = sqliteTable("installmentSchedules", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  contractId: text()
    .notNull()
    .references(() => installmentContracts.id, { onDelete: "cascade" }),
  completed: integer({ mode: "boolean" }).notNull().default(false),
  dueDate: integer({ mode: "timestamp_ms" }).notNull(),
  amountDueCents: integer().notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp_ms" }),
})

export const payments = sqliteTable("payments", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  customerId: text()
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  amountPaidCents: integer().notNull(),
  method: text().$type<PaymentMethod>().notNull(),
  type: text().$type<PaymentType>().notNull(),
  paidAt: integer({ mode: "timestamp_ms" }).notNull(),
  notes: text(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp_ms" }),
})

export const paymentAllocations = sqliteTable("paymentAllocations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  paymentId: text()
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),
  scheduleId: text()
    .notNull()
    .references(() => installmentSchedules.id, { onDelete: "cascade" }),
  amountCents: integer().notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
  deletedAt: integer({ mode: "timestamp_ms" }),
})
