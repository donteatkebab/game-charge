import type { CategoryAttributes } from "./category"
import type { OrderAttributes } from "./order"
import type { OrderMethodFieldAttributes } from "./order-method-field"

export type OrderMethodAttributes = {
  id: number
  documentId: string
  title: string
  sort_order: number
  category: CategoryAttributes
  order_method_fields: OrderMethodFieldAttributes[]
  orders: OrderAttributes[]
}
