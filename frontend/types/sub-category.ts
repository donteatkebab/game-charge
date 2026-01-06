import type { CategoryAttributes } from "./category"
import type { ProductAttributes } from "./product"

export type SubCategoryAttributes = {
  id: number
  documentId: string
  title: string
  sort_order: number
  category: CategoryAttributes
  products: ProductAttributes[]
}
