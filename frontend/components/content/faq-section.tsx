"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const faqs = [
  {
    question: "پرداخت به چه صورت انجام می‌شود؟",
    answer: "پس از ثبت سفارش، پرداخت از طریق درگاه امن انجام می‌شود.",
  },
  {
    question: "زمان تحویل سفارش چقدر است؟",
    answer: "در اغلب موارد، تحویل در همان روز و در ساعات کاری انجام می‌شود.",
  },
  {
    question: "اگر اطلاعات اشتباه وارد کنم چه می‌شود؟",
    answer:
      "در صورت مغایرت اطلاعات، سفارش با تاخیر مواجه می‌شود و نیاز به اصلاح دارد.",
  },
]

export function FaqSection() {
  return (
    <Card className="text-right">
      <CardHeader className="space-y-2">
        <CardTitle>سوالات متداول</CardTitle>
        <Separator />
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="text-right">
          {faqs.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-right flex-row-reverse">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-right text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
