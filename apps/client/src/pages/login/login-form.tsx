import { cn } from "cn"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { ApiClient } from "@/api-client"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export function LoginForm() {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: ApiClient.login,
    onSuccess: () => {
      toast.success("تم تسجيل الدخول")
      navigate("/", { replace: true })
    },
    onError: () => toast.error("فشل تسجيل الدخول"),
  })
  const [showPasswords, setShowPasswords] = useState(false)

  const onSubmitHandler: React.SubmitEventHandler<HTMLFormElement> = (
    event
  ) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const username = formData.get("username") as string
    const password = formData.get("password") as string

    mutation.mutate({ body: { username, password } })
  }

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={onSubmitHandler}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>

          <p className="text-sm text-balance text-muted-foreground">
            ادخل اسم المستخدم وكلمة المرور لتسجيل الدخول. ستحتاج إلى الانترنت في
            المرة الأولى فقط.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="username">اسم المستخدم</FieldLabel>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
          <ButtonGroup>
            <Input
              id="password"
              name="password"
              type={showPasswords ? "text" : "password"}
              required
            />
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowPasswords((s) => !s)}
            >
              {showPasswords ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </ButtonGroup>
        </Field>

        <Field>
          <Button type="submit">تسجيل الدخول</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
