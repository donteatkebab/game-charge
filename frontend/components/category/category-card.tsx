import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { strapiMediaUrl } from "@/lib/strapi-media-url"
import { CategoryAttributes } from "@/types/category"
import Link from "next/link"

export function CategoryCard({ category }: { category: CategoryAttributes }) {

  return (
    <Link href={`/categories/${category.slug}`} className="block focus:outline-hidden">
      <Card className="relative overflow-hidden gap-4">
        <img
          src={strapiMediaUrl(category.banner.url) as string}
          alt={category.banner.alternativeText || category.title}
          width={category.banner.width!}
          height={category.banner.height!}
          loading="lazy"
        />

        <div className="absolute top-0 left-0 p-4">
          <Badge>
            تحویل فوری
          </Badge>
        </div>

        <CardHeader>
          <h2 className="truncate text-lg font-semibold">{category.title}</h2>
          <CardDescription className="truncate">{category.short_description}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end gap-1">
          <Button asChild dir="ltr" size="sm">
            <span>
              مشاهده محصولات
            </span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
