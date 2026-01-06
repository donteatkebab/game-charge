"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; alt: string; src: string }
  | { type: "callout"; title: string; text: string }

const article = {
  heroTitle: "راهنمای کامل خرید و تحویل سریع",
  intro:
    "این راهنما به شما کمک می‌کند مسیر سفارش را بدون ابهام طی کنید. متن زیر نمونه‌ای از محتوای بلند و ساختارمند است تا در آینده بتوان آن را با متن واقعی، تصاویر و توضیحات تکمیلی جایگزین کرد. برای آماده‌سازی بهتر، چند پاراگراف نمونه با طول بلند قرار داده شده است.",
  blocks: [
    { type: "heading", text: "گام اول: انتخاب محصول و منطقه" },
    {
      type: "paragraph",
      text:
        "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ است. لورم ایپسوم با استفاده از حروف‌چینی و طراحی گرافیک به عنوان متن نمونه استفاده می‌شود تا نمایش کلی از چیدمان و فاصله‌ها فراهم شود. اگر منطقه حساب شما با محصول هماهنگ نباشد، احتمال نیاز به اصلاح سفارش وجود دارد.",
    },
    {
      type: "image",
      alt: "تصویر نمونه محصول",
      src: "/placeholder.png",
    },
    {
      type: "paragraph",
      text:
        "در این بخش می‌توان توضیح داد که چه اطلاعاتی از کاربر لازم است و چرا باید دقیق وارد شود. هدف این است که متن قابل جایگزینی باشد و نیازهای محتوایی آینده را پوشش دهد. برای مثال، شماره اکانت، منطقه، یا هر شناسه اختصاصی که برای تحویل لازم است.",
    },
    {
      type: "callout",
      title: "نکته مهم",
      text:
        "اگر اطلاعات ورود یا شناسه حساب ناقص باشد، فرآیند تکمیل سفارش به تعویق می‌افتد. لطفا قبل از ادامه، جزئیات را دوباره بررسی کنید.",
    },
    { type: "heading", text: "گام دوم: تکمیل اطلاعات سفارش" },
    {
      type: "paragraph",
      text:
        "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. این متن برای نمایش طولانی و توضیحات چند پاراگرافی به کار می‌رود. اگر نیاز به بخش‌بندی بیشتر باشد، می‌توان تیترهای فرعی بیشتری اضافه کرد.",
    },
    {
      type: "paragraph",
      text:
        "برای اطمینان از تحویل سریع، اطلاعاتی مانند نام پروفایل یا ایمیل باید کاملا منطبق بر حساب شما باشد. هرگونه اختلاف ممکن است باعث نیاز به هماهنگی مجدد شود. این بخش صرفا نمونه‌ای از محتوای بلند برای نمایش ساختار متن است.",
    },
  ] satisfies ArticleBlock[],
}

function renderBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case "heading":
      return (
        <h3 key={`heading-${index}`} className="text-base font-semibold text-right">
          {block.text}
        </h3>
      )
    case "paragraph":
      return (
        <p
          key={`paragraph-${index}`}
          className="leading-8 text-muted-foreground text-right"
        >
          {block.text}
        </p>
      )
    case "image":
      return (
        <div
          key={`image-${index}`}
          className="overflow-hidden rounded-lg border bg-muted/20"
        >
          <img
            src={block.src}
            alt={block.alt}
            className="h-56 w-full object-cover"
            loading="lazy"
          />
        </div>
      )
    case "callout":
      return (
        <Card key={`callout-${index}`} className="border-dashed">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-end gap-2">
              <CardTitle className="text-sm font-semibold">{block.title}</CardTitle>
              <Badge variant="secondary">یادآوری</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground text-right">
              {block.text}
            </p>
          </CardContent>
        </Card>
      )
    default:
      return null
  }
}

export function ArticleSection() {
  const [isOpen, setIsOpen] = React.useState(false)
  const previewBlocks = article.blocks.slice(0, 1)
  const remainingBlocks = article.blocks.slice(2)

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>مقاله راهنما</CardTitle>
          <Badge variant="secondary">راهنما</Badge>
        </div>
        <p className="text-base font-semibold">{article.heroTitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="leading-8 text-muted-foreground text-right">
          {article.intro}
        </p>
        <Separator />
        <div className="space-y-6">
          {previewBlocks.map((block, index) => renderBlock(block, index))}
        </div>
        {remainingBlocks.length > 0 && (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-6"
          >
            <CollapsibleContent className="space-y-6">
              {remainingBlocks.map((block, index) =>
                renderBlock(block, index + previewBlocks.length)
              )}
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                {isOpen ? "بستن" : "ادامه مقاله"}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
