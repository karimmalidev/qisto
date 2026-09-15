import {
  OPERATION_METHODS,
  OPERATION_RESOURCE_TYPES,
  PAYMENT_METHODS,
  PAYMENT_TYPES,
} from "@qisto/schemas";
import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  real,
  pgEnum,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const users = pgTable("users", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text().notNull(),
  username: text().notNull().unique(),
  hashedPassword: text().notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hashedToken: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  lastSyncedOperationId: uuid(),
  revokedAt: timestamp({ withTimezone: true, mode: "date" }),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const operationResourceType = pgEnum(
  "operationTypes",
  OPERATION_RESOURCE_TYPES,
);

export const operationMethod = pgEnum("operationMethods", OPERATION_METHODS);

export const operations = pgTable("operations", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionId: uuid().references(() => sessions.id, {
    onDelete: "set null",
  }),
  resourceType: operationResourceType().notNull(),
  resourceId: uuid().notNull(),
  method: operationMethod().notNull(),
  payload: json(),
});

export const customers = pgTable("customers", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  phone: text(),
  secondPhone: text(),
  nationalId: text(),
  address: text(),
  notes: text(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: "date" }),
});

export const products = pgTable("products", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  priceCents: integer().notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: "date" }),
});

export const installmentContracts = pgTable("installmentContracts", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  customerId: uuid()
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  productId: uuid()
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  productNameSnapshot: text().notNull(),
  productPriceCentsSnapshot: integer().notNull(),
  discountCents: integer().notNull(),
  downPaymentCents: integer().notNull(),
  interestRatePercent: real().notNull(),
  notes: text(),
  completed: boolean().notNull().default(false),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: "date" }),
});

export const installmentSchedules = pgTable("installmentSchedules", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  contractId: uuid()
    .notNull()
    .references(() => installmentContracts.id, { onDelete: "cascade" }),
  completed: boolean().notNull().default(false),
  dueDate: date({ mode: "date" }).notNull(),
  amountDueCents: integer().notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: "date" }),
});

export const paymentType = pgEnum("paymentTypes", PAYMENT_TYPES);

export const paymentMethod = pgEnum("paymentMethods", PAYMENT_METHODS);

export const payments = pgTable("payments", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  customerId: uuid()
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  amountPaidCents: integer().notNull(),
  method: paymentMethod().notNull(),
  type: paymentType().notNull(),
  paidAt: timestamp({ withTimezone: true, mode: "date" }),
  notes: text(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: "date" }),
});

export const paymentAllocations = pgTable("paymentAllocations", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  paymentId: uuid()
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),
  scheduleId: uuid()
    .notNull()
    .references(() => installmentSchedules.id, { onDelete: "cascade" }),
  amountCents: integer().notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: "date" }),
});
