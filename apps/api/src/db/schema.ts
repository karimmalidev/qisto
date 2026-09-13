import { PAYMENT_METHODS, PAYMENT_TYPES } from "@qisto/schemas";
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
} from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const users = pgTable("users", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  name: text().notNull(),
  username: text().notNull().unique(),
  hashedPassword: text().notNull(),
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
  lastSyncBefore: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  revokedAt: timestamp({ withTimezone: true, mode: "date" }),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const operations = pgTable("operations", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  sessionId: uuid()
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  metadata: text(),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
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
  deletedAt: timestamp({
    withTimezone: true,
    mode: "date",
  }),
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
  deletedAt: timestamp({
    withTimezone: true,
    mode: "date",
  }),
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
  downPaymentCents: integer().notNull(),
  interestRate: real().notNull(),
  notes: text(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true, mode: "date" })
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
  dueDate: date().notNull(),
  amountDueCents: integer().notNull(),
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
  paidAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
  notes: text(),
});

export const paymentAllocations = pgTable("paymentAllocations", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  paymentId: uuid()
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),
  installmentScheduleId: uuid()
    .notNull()
    .references(() => installmentSchedules.id, { onDelete: "cascade" }),
  amountCents: integer().notNull(),
});
