"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { ProductAttributes } from "@/types/product"
import { strapiMediaUrl } from "@/lib/strapi-media-url"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export function ProductCard({ product }: { product: ProductAttributes }) {

  return (
    <Card className="flex-row sm:flex-col sm:items-center xl:flex-row p-4 gap-4 sm:gap-3 xl-gap-6">
      <div className="w-full max-w-17.5 sm:max-w-25.5 flex items-center">
        <img
          src={strapiMediaUrl(product.image.url) as string}
          alt={product.image.alternativeText || product.title}
          width={product.image.width!}
          height={product.image.height!}
          loading="lazy"
          className="rounded-xl"
        />
      </div>

      <div className="w-full flex flex-col justify-center grow gap-1">
        <CardHeader className="px-0 sm:text-center xl:text-right">
          <h3 className="text-lg font-semibold">{product.title}</h3>
        </CardHeader>

        <span className="text-xs font-semibold sm:text-center xl:text-right">{product.regular_price.toLocaleString()} تومان</span>
      </div>
      <div className="flex items-end">
        <Button size="icon-lg">
          <Plus />
        </Button>
      </div>
    </Card>
  )
}
