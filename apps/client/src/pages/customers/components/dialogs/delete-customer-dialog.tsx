import { AppContainer } from "@/app-container"
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import type { customers } from "@/db/schema"
import { useMutation } from "@tanstack/react-query"

export function DeleteCustomerDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: typeof customers.$inferSelect
}) {
  const mutation = useMutation({
    mutationFn: () =>
      AppContainer.getInstance().customerService.update({
        id: customer.id,
        deletedAt: new Date(),
      }),
    onSuccess: (_1, _2, _3, { client }) => {
      client.invalidateQueries()
      onOpenChange(false)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل انت متاكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيتم حذف العميل نهائيا
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            الغاء
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />}
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
