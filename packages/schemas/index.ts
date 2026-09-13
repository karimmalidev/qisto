export * from "./src/errors.ts";
export * from "./src/strings.ts";
export * from "./src/sessions.schema.ts";

export const PAYMENT_TYPES = ["INSTALLMENT", "DOWN_PAYMENT"] as const;

export const PAYMENT_METHODS = [
  "CASH",
  "DIGITAL_WALLET",
  "BANK_TRANSFER",
  "CHEQUE",
  "OTHER",
] as const;
