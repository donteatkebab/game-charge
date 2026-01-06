import type { OrderMethodAttributes } from "./order-method"

export type OrderMethodFieldAttributes = {
  id: number
  documentId: string
  label: string
  type: "text" | "email" | "password" | "number"
  sort_order: number
  order_method: OrderMethodAttributes
}
