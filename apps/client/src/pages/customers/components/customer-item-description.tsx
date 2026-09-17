import { Badge } from "@/components/ui/badge"
import { ItemDescription } from "@/components/ui/item"
import type { customers } from "@/db/schema"
import {
  PhoneIcon,
  IdCardIcon,
  MapPinIcon,
  NotebookPenIcon,
} from "lucide-react"

export function CustomerItemDescription({
  customer,
}: {
  customer: typeof customers.$inferSelect
}) {
  return (
    <ItemDescription className="line-clamp-none flex flex-wrap gap-1">
      {(
        [
          ["phone", "هاتف", PhoneIcon],
          ["secondPhone", "هاتف ثانوي", PhoneIcon],
          ["nationalId", "رقم بطاقة", IdCardIcon],
          ["address", "العنوان", MapPinIcon],
          ["notes", "ملاحظات", NotebookPenIcon],
        ] as const
      ).map(
        ([key, title, Icon]) =>
          customer[key] && (
            <Badge
              variant="secondary"
              className="h-auto max-w-full min-w-0 whitespace-normal"
            >
              <Icon />
              <span className="font-normal">{title}:</span>
              <span>{customer[key]}</span>
            </Badge>
          )
      )}
    </ItemDescription>
  )
}
