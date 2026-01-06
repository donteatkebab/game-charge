import type { CategoryAttributes } from "./category"

export type CommentAttributes = {
  id: number
  documentId: string
  content: string
  comment_status: "pending" | "approved" | "rejected"
  users_permissions_user: unknown
  category: CategoryAttributes
}
