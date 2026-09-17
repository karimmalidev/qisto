import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldLabel,
  Field,
  FieldDescription,
} from "@/components/ui/field"
import { ProductItem } from "@/pages/products/components/product-item"
import { PlusIcon, ReplaceIcon } from "lucide-react"
import { ProductsCombobox } from "./products-combobox"
import type { products } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CreateProductDialog } from "@/pages/products/components/dialogs/create-product-dialog"

export function ProductFieldSet({
  product,
  setProduct,
}: {
  product: typeof products.$inferSelect | null
  setProduct: (product: typeof products.$inferSelect | null) => void
}) {
  const [createProductOpen, setCreateProductOpen] = useState(false)

  return (
    <>
      <FieldSet>
        <FieldLegend>بيانات الصنف</FieldLegend>

        <FieldGroup>
          <Field>
            <FieldLabel>الصنف</FieldLabel>
            {product && <ProductItem product={product} hideActions />}
            {!product && (
              <>
                <ProductsCombobox product={product} setProduct={setProduct} />
                <FieldDescription className="flex items-center gap-2">
                  لم تجد الصنف؟{" "}
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setCreateProductOpen(true)}
                    type="button"
                  >
                    <PlusIcon /> صنف جديد
                  </Button>
                </FieldDescription>
              </>
            )}
            {product && (
              <Button
                onClick={() => setProduct(null)}
                size="sm"
                variant="secondary"
              >
                <ReplaceIcon />
                تغيير الصنف
              </Button>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <CreateProductDialog
        open={createProductOpen}
        onOpenChange={setCreateProductOpen}
      />
    </>
  )
}
