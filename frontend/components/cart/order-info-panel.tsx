"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const info = {
  categoryTitle: "راهنمای خرید گیفت کارت",
  categoryDescription:
    "قبل از ثبت سفارش، اطلاعات حساب و منطقه را دقیق وارد کنید تا تحویل سریع‌تر انجام شود.",
  instructions: [
    "محصول مورد نظر را انتخاب کنید.",
    "روش سفارش را تعیین کنید.",
    "اطلاعات لازم را وارد کنید.",
    "سفارش را نهایی کنید.",
  ],
  rules: [
    "بازگشت وجه فقط قبل از پردازش امکان‌پذیر است.",
    "تحویل فوری در ساعات کاری انجام می‌شود.",
    "اطلاعات حساب باید دقیق و معتبر باشد.",
  ],
  support: [
    { label: "تلگرام", value: "@gamecharge_support" },
    { label: "واتساپ", value: "+98 912 000 0000" },
  ],
}

export function OrderInfoPanel() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{info.categoryTitle}</CardTitle>
          <Badge variant="secondary">راهنما</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {info.categoryDescription}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">مراحل انجام سفارش</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {info.instructions.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-muted-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">نکات مهم</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {info.rules.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="mt-1 size-1.5 rounded-full bg-muted-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">پشتیبانی</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {info.support.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2"
              >
                <span>{item.label}</span>
                <span dir="ltr" className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
