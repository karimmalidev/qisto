import { useNavigate } from "react-router"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { CircleAlert } from "lucide-react"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlert />
          </EmptyMedia>

          <EmptyTitle>الصفحة غير موجودة</EmptyTitle>

          <EmptyDescription>الصفحة التي تبحث عنها غير موجودة</EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button onClick={() => navigate("/")}>الصفحة الرئيسية</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
