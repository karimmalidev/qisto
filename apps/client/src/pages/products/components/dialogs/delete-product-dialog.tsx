import { AppContainer } from "@/app-container"
import {
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialog,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { products } from "@/db/schema"
import { useMutation } from "@tanstack/react-query"

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: typeof products.$inferSelect
}) {
  const mutation = useMutation({
    mutationFn: () =>
      AppContainer.getInstance().productService.update({
        id: product.id,
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
          <AlertDialogDescription>سيتم حذف الصنف نهائيا</AlertDialogDescription>
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
