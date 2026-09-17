import {
  OPERATION_METHODS,
  OPERATION_RESOURCE_TYPES,
  PAYMENT_METHODS,
  PAYMENT_TYPES,
} from "@qisto/schemas"
import {
  integer,
  index,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core"
import { v7 } from "uuid"

export const sessions = sqliteTable("sessions", {
  id: integer().primaryKey().default(1),
  lastSyncedOperationId: text(),
})

export const operations = sqliteTable("operations", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  resourceType: text({ enum: OPERATION_RESOURCE_TYPES }).notNull(),
  resourceId: text().notNull(),
  method: text({ enum: OPERATION_METHODS }).notNull(),
  payload: text({ mode: "json" }),
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

export const installmentContracts = sqliteTable(
  "installmentContracts",
  {
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
  },
  (table) => [
    index("installment_contracts_customer_id_idx").on(table.customerId),
    index("installment_contracts_product_id_idx").on(table.productId),
  ]
)

export const installmentSchedules = sqliteTable(
  "installmentSchedules",
  {
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
  },
  (table) => [
    index("installment_schedules_contract_id_idx").on(table.contractId),
  ]
)

export const payments = sqliteTable(
  "payments",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => v7()),
    customerId: text()
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    amountPaidCents: integer().notNull(),
    method: text({ enum: PAYMENT_METHODS }).notNull(),
    type: text({ enum: PAYMENT_TYPES }).notNull(),
    paidAt: integer({ mode: "timestamp_ms" }).notNull(),
    notes: text(),
    updatedAt: integer({ mode: "timestamp_ms" })
      .notNull()
      .$onUpdateFn(() => new Date())
      .$defaultFn(() => new Date()),
    deletedAt: integer({ mode: "timestamp_ms" }),
  },
  (table) => [index("payments_customer_id_idx").on(table.customerId)]
)

export const paymentAllocations = sqliteTable(
  "paymentAllocations",
  {
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
  },
  (table) => [
    unique("payment_allocations_payment_schedule_unique").on(
      table.paymentId,
      table.scheduleId
    ),
    index("payment_allocations_schedule_id_idx").on(table.scheduleId),
  ]
)
