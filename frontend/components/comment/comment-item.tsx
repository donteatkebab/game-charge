"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { CommentAttributes } from "@/types/comment"

export type CommentListItem = Pick<
  CommentAttributes,
  "id" | "documentId" | "content" | "comment_status" | "users_permissions_user"
>

const statusLabels: Record<
  NonNullable<CommentAttributes["comment_status"]>,
  string
> = {
  pending: "در انتظار",
  approved: "تایید شده",
  rejected: "رد شده",
}

function getDisplayName(comment: CommentListItem) {
  const user = comment.users_permissions_user as
    | { username?: string; phone?: string; id?: number | string }
    | null
    | undefined

  if (user?.username) return user.username
  if (user?.phone) return user.phone

  const fallbackId =
    user?.id ??
    (typeof comment.id === "number"
      ? comment.id.toLocaleString("fa-IR")
      : comment.id) ??
    comment.documentId

  return `کاربر ${fallbackId ?? "ناشناس"}`
}

export function CommentItem({ comment }: { comment: CommentListItem }) {
  const displayName = getDisplayName(comment)
  const statusLabel = comment.comment_status
    ? statusLabels[comment.comment_status]
    : null
  const fallbackLetter = displayName.trim().slice(0, 1) || "؟"

  return (
    <div className="flex flex-row items-start gap-3">
      <Avatar>
        <AvatarFallback>{fallbackLetter}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2 text-right">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">{displayName}</span>
          {statusLabel && <Badge variant="secondary">{statusLabel}</Badge>}
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          {comment.content}
        </p>
      </div>
    </div>
  )
}
