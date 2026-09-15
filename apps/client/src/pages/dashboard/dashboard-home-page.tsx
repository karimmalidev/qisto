import { ApiClient } from "@/api-client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function DashboardHomePage() {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: ApiClient.logout,
    onSuccess: () => navigate("/login", { replace: true }),
    onError: () => toast.error("فشل تسجيل الخروج"),
  })
  return (
    <div>
      dashboard home page
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending && <Spinner />}
        تسجيل الخروج
      </Button>
    </div>
  )
}
