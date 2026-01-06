import type { CategoryAttributes } from "./category"
import type { StrapiMedia } from "./strai-media"
import type { SubCategoryAttributes } from "./sub-category"

export type ProductAttributes = {
  id: number
  documentId: string
  title: string
  image: StrapiMedia
  regular_price: number
  max_quantity: number
  sort_order: number
  category: CategoryAttributes
  sub_category: SubCategoryAttributes
  orders: unknown
}
