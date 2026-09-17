import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  Field,
  FieldLabel,
  FieldSeparator,
  FieldDescription,
  FieldContent,
} from "@/components/ui/field"
import { useEffect, useMemo, useState } from "react"
import { customers, products } from "@/db/schema"
import { Link } from "react-router"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CustomerFieldSet } from "./_components/customer/customer-fieldset"
import { ProductFieldSet } from "./_components/product/product-fieldset"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { arEG } from "date-fns/locale"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { minMaxRound } from "@/lib/number"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export const FREQUENCY_TITLE_KV = {
  weekly: "أسبوعي",
  biweekly: "نصف شهري",
  monthly: "شهري",
  quarterly: "ربع سنوي",
} as const

export const INSTALLMENTS_COUNT_LIMIT = 99

export function CreateInstallmentContractPage() {
  const [customer, setCustomer] = useState<
    typeof customers.$inferSelect | null
  >(null)
  const [product, setProduct] = useState<typeof products.$inferSelect | null>(
    null
  )

  const priceCents = product?.priceCents ?? 0
  const [contract, setContract] = useState({
    enableDiscount: false,
    discountCents: 0,
    downPaymentCents: 0,
    interestCents: 0,
    startDate: new Date(),
    installmentCents: 0,
    installmentsFrequency: "monthly" as keyof typeof FREQUENCY_TITLE_KV,
    separateRemaining: false,
  })

  const setEnableDiscount = (v: boolean) =>
    setContract((c) => ({ ...c, enableDiscount: v }))
  const setDiscountCents = (v: number) =>
    setContract((c) => ({
      ...c,
      discountCents: minMaxRound(0, priceCents, v),
    }))
  const setDownPaymentCents = (v: number) =>
    setContract((c) => ({
      ...c,
      downPaymentCents: minMaxRound(0, priceAfterDiscountCents, v),
    }))
  const setInterestCents = (v: number) =>
    setContract((c) => ({
      ...c,
      interestCents: minMaxRound(0, Infinity, v),
    }))
  const setStartDate = (v: Date) =>
    setContract((c) => ({
      ...c,
      startDate: v,
    }))
  const setInstallmentCents = (v: number) =>
    setContract((c) => ({
      ...c,
      installmentCents: minMaxRound(
        Math.ceil(priceAfterInterestCents / 100 / INSTALLMENTS_COUNT_LIMIT) *
          100,
        priceAfterInterestCents,
        v
      ),
    }))
  const setInstallmentFrequency = (v: keyof typeof FREQUENCY_TITLE_KV) =>
    setContract((c) => ({
      ...c,
      installmentsFrequency: v,
    }))
  const setSeparateRemaining = (v: boolean) =>
    setContract((c) => ({
      ...c,
      separateRemaining: v,
    }))

  const discountPercent = Number(
    ((contract.discountCents * 100) / priceCents).toFixed(4)
  )
  const priceAfterDiscountCents =
    priceCents - (contract.enableDiscount ? contract.discountCents : 0)
  const priceAfterDownPaymentCents =
    priceAfterDiscountCents - contract.downPaymentCents
  const interestPercent =
    priceAfterDownPaymentCents > 0
      ? Number(
          ((contract.interestCents * 100) / priceAfterDownPaymentCents).toFixed(
            4
          )
        )
      : 0
  const priceAfterInterestCents =
    priceAfterDownPaymentCents + contract.interestCents

  const setDiscountPercent = (v: number) =>
    setDiscountCents((priceCents * v) / 100)
  const setPriceAfterDiscountCents = (v: number) =>
    setDiscountCents(priceCents - v)
  const setPriceAfterDownPaymentsCents = (v: number) =>
    setDownPaymentCents(priceAfterDiscountCents - v)
  const setInterestPercent = (v: number) =>
    setInterestCents((priceAfterDownPaymentCents * v) / 100)
  const setPriceAfterInterestCents = (v: number) =>
    setInterestCents(v - priceAfterDownPaymentCents)

  useEffect(() => {
    setContract({
      enableDiscount: false,
      discountCents: 0,
      downPaymentCents: 0,
      interestCents: 0,
      startDate: new Date(),
      installmentCents: 0,
      installmentsFrequency: "monthly" as keyof typeof FREQUENCY_TITLE_KV,
      separateRemaining: false,
    })
  }, [product])
  useEffect(() => {
    setDownPaymentCents(contract.downPaymentCents)
  }, [contract.discountCents])
  useEffect(() => {
    setInterestCents(contract.interestCents)
  }, [contract.downPaymentCents])
  useEffect(() => {
    setInstallmentCents(priceAfterInterestCents)
  }, [priceAfterInterestCents])

  const installmentSchedules = useMemo(() => {
    if (contract.installmentCents <= 0) return []

    const count = (contract.separateRemaining ? Math.ceil : Math.floor)(
      priceAfterInterestCents / contract.installmentCents
    )
    let remaining = priceAfterInterestCents

    return Array.from({ length: count }, (_, index) => {
      const dueDate = new Date(contract.startDate)
      let amountDueCents = Math.min(remaining, contract.installmentCents)

      if (index == count - 1 && !contract.separateRemaining) {
        amountDueCents = remaining
      } else {
        remaining -= amountDueCents
      }

      switch (contract.installmentsFrequency) {
        case "monthly":
          dueDate.setMonth(dueDate.getMonth() + index)
          break
        case "quarterly":
          dueDate.setMonth(dueDate.getMonth() + index * 3)
          break
        case "weekly":
          dueDate.setDate(dueDate.getDate() + index * 7)
          break
        case "biweekly":
          dueDate.setDate(dueDate.getDate() + index * 14)
          break
      }

      return {
        dueDate,
        amountDueCents,
      }
    })
  }, [
    priceAfterInterestCents,
    contract.installmentCents,
    contract.installmentsFrequency,
    contract.startDate,
    contract.separateRemaining,
  ])

  return (
    <PageContainer title="عقد تقسيط جديد">
      <div className="w-full max-w-3xl">
        <form>
          <FieldGroup>
            <CustomerFieldSet customer={customer} setCustomer={setCustomer} />

            <FieldSeparator />

            <ProductFieldSet product={product} setProduct={setProduct} />

            {product && (
              <>
                <FieldSet>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Checkbox
                        id="discount-checkbox"
                        checked={contract.enableDiscount}
                        onCheckedChange={(v) => setEnableDiscount(!!v)}
                      />
                      <FieldLabel
                        htmlFor="discount-checkbox"
                        className="font-normal"
                      >
                        خصم على الصنف
                      </FieldLabel>
                    </Field>

                    {contract.enableDiscount && (
                      <div className="grid gap-4 lg:grid-cols-[1fr_2fr_2fr]">
                        <Field>
                          <FieldLabel>نسبة الخصم</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              value={discountPercent}
                              onChange={(e) =>
                                setDiscountPercent(Number(e.target.value))
                              }
                              min={0}
                              max={100}
                              type="number"
                            />
                            <InputGroupAddon align={"inline-end"}>
                              %
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>

                        <Field>
                          <FieldLabel>الخصم</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              value={contract.discountCents / 100}
                              onChange={(e) =>
                                setDiscountCents(Number(e.target.value) / 100)
                              }
                              min={0}
                              max={priceCents / 100}
                              type="number"
                            />
                            <InputGroupAddon align={"inline-end"}>
                              جـ
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>

                        <Field>
                          <FieldLabel>السعر بعد الخصم</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              value={priceAfterDiscountCents / 100}
                              onChange={(e) =>
                                setPriceAfterDiscountCents(
                                  Number(e.target.value) * 100
                                )
                              }
                              min={0}
                              max={priceCents / 100}
                              type="number"
                            />
                            <InputGroupAddon align={"inline-end"}>
                              جـ
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                      </div>
                    )}
                  </FieldGroup>
                </FieldSet>

                <FieldSeparator />

                <FieldSet>
                  <FieldLegend>حساب الفائدة</FieldLegend>
                  <FieldGroup>
                    <div className="grid gap-4 lg:grid-cols-[1fr_2fr_2fr]">
                      <Field className="lg:col-span-2">
                        <FieldLabel>المقدم</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={contract.downPaymentCents / 100}
                            onChange={(e) =>
                              setDownPaymentCents(Number(e.target.value) * 100)
                            }
                            min={0}
                            max={priceAfterDiscountCents / 100}
                            type="number"
                          />
                          <InputGroupAddon align={"inline-end"}>
                            ج
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel>المستحق بعد المقدم</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={priceAfterDownPaymentCents / 100}
                            onChange={(e) =>
                              setPriceAfterDownPaymentsCents(
                                Number(e.target.value) * 100
                              )
                            }
                            min={0}
                            max={priceAfterDiscountCents / 100}
                            type="number"
                          />
                          <InputGroupAddon align={"inline-end"}>
                            ج
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel>نسبة الفائدة</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={interestPercent}
                            onChange={(e) =>
                              setInterestPercent(Number(e.target.value))
                            }
                            min={0}
                            type="number"
                          />
                          <InputGroupAddon align={"inline-end"}>
                            %
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel>الفائدة</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={contract.interestCents / 100}
                            onChange={(e) =>
                              setInterestCents(Number(e.target.value) * 100)
                            }
                            min={0}
                            type="number"
                          />
                          <InputGroupAddon align={"inline-end"}>
                            جـ
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel>المستحق بعد الفائدة</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={priceAfterInterestCents / 100}
                            onChange={(e) =>
                              setPriceAfterInterestCents(
                                Number(e.target.value) * 100
                              )
                            }
                            min={0}
                            type="number"
                          />
                          <InputGroupAddon align={"inline-end"}>
                            جـ
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>

                <Separator />

                <FieldSet>
                  <FieldLegend>توزيع الاقساط</FieldLegend>
                  <FieldGroup>
                    <div className="grid gap-4 lg:grid-cols-[2fr_2fr_3fr]">
                      <Field>
                        <FieldLabel>قيمة القسط</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            value={contract.installmentCents / 100}
                            onChange={(e) =>
                              setInstallmentCents(Number(e.target.value) * 100)
                            }
                            min={0}
                            max={priceAfterInterestCents / 100}
                          />
                          <InputGroupAddon align={"inline-end"}>
                            جـ
                          </InputGroupAddon>
                        </InputGroup>
                      </Field>

                      <Field>
                        <FieldLabel>نوع التقسيط</FieldLabel>
                        <Select
                          value={contract.installmentsFrequency}
                          onValueChange={setInstallmentFrequency}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.entries(FREQUENCY_TITLE_KV).map(
                                ([k, v]) => (
                                  <SelectItem key={k} value={k}>
                                    {v}
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field>
                        <FieldLabel>موعد أول قسط</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="secondary" className="bg-input/50">
                              {formatDate(contract.startDate)}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              locale={arEG}
                              selected={contract.startDate}
                              onSelect={(v) => setStartDate(v!)}
                              defaultMonth={contract.startDate}
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                    </div>
                  </FieldGroup>

                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Switch
                        id="switch"
                        checked={contract.separateRemaining}
                        onCheckedChange={setSeparateRemaining}
                      />
                      <FieldContent>
                        <FieldLabel htmlFor="switch">فصل الباقي</FieldLabel>
                        <FieldDescription>
                          {contract.separateRemaining
                            ? "سيتم فصل الباقي في قسط منفصل"
                            : "سيتم إضافة الباقي إلى القسط الأخير"}
                        </FieldDescription>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel>مواعيد السداد</FieldLabel>

                      <ItemGroup>
                        {installmentSchedules.map(
                          ({ dueDate, amountDueCents }, index) => (
                            <Item key={index} size="xs" variant="muted">
                              <ItemMedia>
                                <Badge variant="secondary">
                                  {formatNumber(index + 1)}
                                </Badge>
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle>
                                  <span className="font-bold">
                                    {formatCurrency(amountDueCents / 100)}
                                  </span>
                                  <Separator orientation="vertical" />
                                  <span className="font-normal">
                                    {formatDate(dueDate)}
                                  </span>
                                </ItemTitle>
                              </ItemContent>
                            </Item>
                          )
                        )}
                      </ItemGroup>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </>
            )}

            <Field orientation="horizontal">
              <Button type="submit">حفظ</Button>
              <Link to="/">
                <Button variant="outline" type="button">
                  الغاء
                </Button>
              </Link>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </PageContainer>
  )
}
