import z from "zod";
import { customerSchema } from "./customer.schema.ts";
import { installmentScheduleSchema } from "./installment-schedule.schema.ts";
import { installmentContractSchema } from "./installment-contract.schema.ts";
import { productSchema } from "./product.schema.ts";
import { paymentSchema } from "./payment.schema.ts";
import { paymentAllocationSchema } from "./payment-allocation.schema.ts";

export const OPERATION_METHODS = ["UPSERT"] as const;

export const OPERATION_RESOURCE_TYPES = [
  "CUSTOMER",
  "PRODUCT",
  "INSTALLMENT_CONTRACT",
  "INSTALLMENT_SCHEDULE",
  "PAYMENT",
  "PAYMENT_ALLOCATION",
] as const;

export type OperationMethod = (typeof OPERATION_METHODS)[number];

export type OperationResourceType = (typeof OPERATION_RESOURCE_TYPES)[number];

const operationSchemaBase = z.object({
  id: z.uuid(),
  resourceId: z.uuid(),
  method: z.enum(OPERATION_METHODS),
});

export const operationSchema = z.union([
  operationSchemaBase.extend({
    resourceType: z.literal("CUSTOMER"),
    payload: customerSchema,
  }),
  operationSchemaBase.extend({
    resourceType: z.literal("PRODUCT"),
    payload: productSchema,
  }),
  operationSchemaBase.extend({
    resourceType: z.literal("INSTALLMENT_CONTRACT"),
    payload: installmentContractSchema,
  }),
  operationSchemaBase.extend({
    resourceType: z.literal("INSTALLMENT_SCHEDULE"),
    payload: installmentScheduleSchema,
  }),
  operationSchemaBase.extend({
    resourceType: z.literal("PAYMENT"),
    payload: paymentSchema,
  }),
  operationSchemaBase.extend({
    resourceType: z.literal("PAYMENT_ALLOCATION"),
    payload: paymentAllocationSchema,
  }),
]);

export type Operation = z.infer<typeof operationSchema>;
