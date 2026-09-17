import { AppContainer } from "@/app-container"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import type { products } from "@/db/schema"
import { useMutation } from "@tanstack/react-query"

export function UpdateProductDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: typeof products.$inferSelect
}) {
  const mutation = useMutation({
    mutationFn: AppContainer.getInstance().productService.update,
    onSuccess: (_1, _2, _3, { client }) => {
      client.invalidateQueries()
      onOpenChange(false)
    },
  })

  const onSubmitHandler: React.SubmitEventHandler<HTMLFormElement> = (
    event
  ) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const priceCents = Number(formData.get("price")) * 100

    mutation.mutate({ id: product.id, name, priceCents })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>تحديث صنف</DialogTitle>
            <DialogDescription>ادخل تفاصيل الصنف ثم اضغط حفظ</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">الاسم</FieldLabel>
              <Input
                id="name"
                name="name"
                defaultValue={product.name}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="price">السعر</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  defaultValue={product.priceCents / 100}
                  required
                />
                <InputGroupAddon align="inline-end">جـ</InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={mutation.isPending}>
                الغاء
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />}
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
