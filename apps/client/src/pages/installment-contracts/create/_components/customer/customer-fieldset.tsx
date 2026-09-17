import {
  FieldLegend,
  FieldGroup,
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { CustomerItem } from "@/pages/customers/components/customer-item"
import { PlusIcon, ReplaceIcon } from "lucide-react"
import { CustomersCombobox } from "./customers-combobox"
import type { customers } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { CreateCustomerDialog } from "@/pages/customers/components/dialogs/create-customer-dialog"
import { useState } from "react"

export function CustomerFieldSet({
  customer,
  setCustomer,
}: {
  customer: typeof customers.$inferSelect | null
  setCustomer: (customer: typeof customers.$inferSelect | null) => void
}) {
  const [createCustomerOpen, setCreateCustomerOpen] = useState(false)

  return (
    <>
      <FieldSet>
        <FieldLegend>بيانات العميل</FieldLegend>

        <FieldGroup>
          <Field>
            <FieldLabel>العميل</FieldLabel>
            {customer && <CustomerItem customer={customer} hideActions />}
            {!customer && (
              <>
                <CustomersCombobox
                  customer={customer}
                  setCustomer={setCustomer}
                />
                <FieldDescription className="flex items-center gap-2">
                  لم تجد العميل؟{" "}
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setCreateCustomerOpen(true)}
                    type="button"
                  >
                    <PlusIcon /> عميل جديد
                  </Button>
                </FieldDescription>
              </>
            )}
            {customer && (
              <Button
                onClick={() => setCustomer(null)}
                size="sm"
                variant="secondary"
              >
                <ReplaceIcon />
                تغيير العميل
              </Button>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <CreateCustomerDialog
        open={createCustomerOpen}
        onOpenChange={setCreateCustomerOpen}
      />
    </>
  )
}
