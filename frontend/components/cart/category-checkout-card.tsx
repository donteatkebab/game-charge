"use client"

import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"
import type { OrderMethodAttributes } from "@/types/order-method"
import type { OrderMethodFieldAttributes } from "@/types/order-method-field"
import { useCategoryCart } from "./category-cart-context"

const getMethodId = (method: OrderMethodAttributes) =>
  method.documentId || String(method.id)

const getFieldId = (field: OrderMethodFieldAttributes) =>
  field.documentId || String(field.id)

export function CategoryCheckoutCard({
  orderMethods,
}: {
  orderMethods: OrderMethodAttributes[]
}) {
  const { state: cartState } = useCategoryCart()
  const [selectedOrderMethodId, setSelectedOrderMethodId] = React.useState<
    string | null
  >(null)
  const [fields, setFields] = React.useState<Record<string, string>>({})
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!orderMethods.length) return
    const firstId = getMethodId(orderMethods[0])
    if (!selectedOrderMethodId) {
      setSelectedOrderMethodId(firstId)
      setFields({})
      return
    }
    const stillExists = orderMethods.some(
      (method) => getMethodId(method) === selectedOrderMethodId
    )
    if (!stillExists) {
      setSelectedOrderMethodId(firstId)
      setFields({})
    }
  }, [orderMethods, selectedOrderMethodId])

  const selectedMethod = orderMethods.find(
    (method) => getMethodId(method) === selectedOrderMethodId
  )
  const isCartEmpty = !cartState.productId

  return (
    <Card className="">
      <CardContent>
        <FieldGroup className="">
          <Field>
            <FieldLabel className="">روش ورود</FieldLabel>
            <RadioGroup
              value={selectedOrderMethodId ?? ""}
              onValueChange={(value) => {
                setSelectedOrderMethodId(value)
                setFields({})
              }}
              className="grid gap-4 text-right"
            >
              {orderMethods.map((method) => {
                const methodId = getMethodId(method)
                return (
                  <FieldLabel
                    key={methodId}
                    htmlFor={`order-method-${methodId}`}
                    className={cn(
                      "w-full rounded-full border px-3 py-2 bg-input/30 flex items-center",
                      selectedOrderMethodId === methodId &&
                      "border-primary bg-primary/5 dark:bg-primary/10"
                    )}
                  >
                    <div className="flex w-full items-center gap-3">
                      <div className="flex flex-1 flex-col gap-1 ">
                        <div className="text-sm font-medium">{method.title}</div>
                      </div>
                      <RadioGroupItem
                        id={`order-method-${methodId}`}
                        value={methodId}
                        aria-label={method.title}
                      />
                    </div>
                  </FieldLabel>
                )
              })}
            </RadioGroup>
          </Field>

          <FieldGroup>
            {selectedMethod?.order_method_fields?.map((field) => {
              const fieldId = getFieldId(field)
              return (
                <Field key={fieldId}>
                  <FieldLabel
                    className="text-right"
                    htmlFor={`order-method-field-${fieldId}`}
                  >
                    {field.label}
                  </FieldLabel>
                  <Input
                    id={`order-method-field-${fieldId}`}
                    type={field.type}
                    value={fields[fieldId] ?? ""}
                    onChange={(event) => {
                      const next = event.target.value
                      setFields((prev) => ({ ...prev, [fieldId]: next }))
                    }}
                    className="text-right"
                  />
                </Field>
              )
            })}
          </FieldGroup>

          <Field>
            <FieldLabel className="text-right" htmlFor="checkout-notes">
              یادداشت شما
            </FieldLabel>
            <Textarea
              id="checkout-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="اطلاعات حساب یا توضیحات تکمیلی"
              rows={4}
              className="text-right"
            />
            {isCartEmpty && (
              <FieldDescription className="text-right">
                برای ادامه یک محصول انتخاب کنید.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          className="w-full"
          disabled={isCartEmpty}
          onClick={() => {
            console.log({
              cartState,
              selectedOrderMethodId,
              fields,
              notes,
            })
          }}
        >
          ادامه
        </Button>
      </CardFooter>
    </Card>
  )
}
