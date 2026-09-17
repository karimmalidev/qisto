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
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { useMutation } from "@tanstack/react-query"

export function CreateCustomerDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const mutation = useMutation({
    mutationFn: AppContainer.getInstance().customerService.create,
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
    const phone = (formData.get("phone") as string).trim() ?? null
    const secondPhone = (formData.get("secondPhone") as string).trim() ?? null
    const nationalId = (formData.get("nationalId") as string).trim() ?? null
    const address = (formData.get("address") as string).trim() ?? null
    const notes = (formData.get("notes") as string).trim() ?? null

    mutation.mutate({ name, phone, secondPhone, nationalId, address, notes })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>اضافة عميل</DialogTitle>
            <DialogDescription>
              ادخل اسم العميل على الأقل ثم اضغط حفظ.
              <br />
              جميع الخانات اختيارية ما عدا الاسم
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="max-h-[60dvh] overflow-y-scroll">
            <Field>
              <FieldLabel htmlFor="name">الاسم</FieldLabel>
              <Input id="name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">رقم الهاتف</FieldLabel>
              <InputGroup>
                <InputGroupInput id="phone" name="phone" type="tel" />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="secondPhone">رقم هاتف ثانوي</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="secondPhone"
                  name="secondPhone"
                  type="tel"
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="nationalId">
                رقم بطاقة الرقم القومي
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="nationalId"
                  name="nationalId"
                  type="number"
                  maxLength={14}
                  minLength={14}
                  className="text-left [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="address">العنوان</FieldLabel>
              <InputGroup>
                <InputGroupInput id="address" name="address" type="text" />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">ملاحظات</FieldLabel>
              <InputGroup>
                <InputGroupTextarea id="notes" name="notes" />
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
