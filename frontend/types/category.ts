import type { ProductAttributes } from "./product"
import type { StrapiMedia } from "./strai-media"
import type { SubCategoryAttributes } from "./sub-category"
import type { CommentAttributes } from "./comment"
import type { OrderMethodAttributes } from "./order-method"
import type { OrderAttributes } from "./order"

export type CategoryAttributes = {
  id: number
  documentId: string
  title: string
  slug: string
  type: "game" | "app" | "giftcard"
  short_description: string
  seo_description: string
  icon: StrapiMedia
  banner: StrapiMedia
  sort_order: number
  sub_categories: SubCategoryAttributes
  products: ProductAttributes
  comments: CommentAttributes[]
  order_methods: OrderMethodAttributes[]
  orders: OrderAttributes[]
}
