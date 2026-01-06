import type { CategoryAttributes } from "./category"
import type { OrderMethodAttributes } from "./order-method"
import type { ProductAttributes } from "./product"

export type OrderAttributes = {
  id: number
  documentId: string
  amount: number
  order_status: "pending" | "processing" | "done" | "cancelled" | "rejected"
  quantity: number
  notes_user?: string | null
  notes_admin?: string | null
  users_permissions_user: unknown
  category: CategoryAttributes
  product: ProductAttributes
  order_method: OrderMethodAttributes
  payment_track_id?: string | null
  payment_gateway?: "zibal" | null
  paid_at?: string | null
}
