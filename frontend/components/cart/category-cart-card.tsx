"use client"

import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useCategoryCart } from "./category-cart-context"
import { ShoppingCart, ArrowUp } from "lucide-react"

export function CategoryCartCard() {
  const { state, setQuantity, reset } = useCategoryCart()
  const hasProduct = Boolean(state.productId)

  if (!hasProduct) {
    return (
      <Card className="text-right">
        <CardContent>
          <Empty className="p-4 md:p-6 lg:p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingCart />
              </EmptyMedia>
              <EmptyTitle>سبد خرید خالی است</EmptyTitle>
              <EmptyDescription>برای شروع، یک محصول به سبد اضافه کنید.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center">
                <Button>
                  <a href="#products">برو به محصولات</a>
                  <ArrowUp />
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const total =
    typeof state.unitPrice === "number"
      ? state.unitPrice * state.quantity
      : 0

  const totalLabel =
    typeof state.unitPrice === "number"
      ? `${total.toLocaleString("fa-IR")} تومان`
      : "—"

  return (
    <Card className="text-right">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>محصول انتخاب‌شده</Label>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="font-medium">
              {state.productTitle || "محصول انتخاب‌شده"}
            </span>
            <Badge variant="secondary">
              {typeof state.unitPrice === "number"
                ? `قیمت واحد: ${state.unitPrice.toLocaleString("fa-IR")} تومان`
                : "قیمت مشخص نیست"}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="cart-quantity">تعداد</Label>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="کم کردن"
              onClick={() => setQuantity(state.quantity - 1)}
            >
              -
            </Button>
            <Input
              id="cart-quantity"
              type="number"
              min={1}
              value={state.quantity}
              onChange={(event) => {
                const next = Number(event.target.value)
                setQuantity(Number.isFinite(next) ? next : 1)
              }}
              className="w-24 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="زیاد کردن"
              onClick={() => setQuantity(state.quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">جمع کل</span>
          <span className="text-lg font-semibold">{totalLabel}</span>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="ghost" onClick={reset}>
          پاک کردن
        </Button>
      </CardFooter>
    </Card>
  )
}
