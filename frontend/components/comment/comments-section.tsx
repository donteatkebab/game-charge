"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CommentItem, type CommentListItem } from "./comment-item"

const fakeComments: CommentListItem[] = [
  {
    id: 1,
    documentId: "comment-1",
    content:
      "خیلی سریع تحویل گرفتم و همه چیز دقیق بود. ممنون از پشتیبانی خوبتون.",
    comment_status: "approved",
    users_permissions_user: { id: 101, username: "مهدی" },
  },
  {
    id: 2,
    documentId: "comment-2",
    content:
      "اطلاعات حساب رو اشتباه وارد کرده بودم اما سریع راهنمایی شدم و اصلاح شد.",
    comment_status: "pending",
    users_permissions_user: { id: 102, username: "الهام" },
  },
  {
    id: 3,
    documentId: "comment-3",
    content:
      "کیفیت عالی بود ولی بهتره زمان تحویل دقیق‌تر اطلاع داده بشه.",
    comment_status: "approved",
    users_permissions_user: { id: 103, username: "پویان" },
  },
  {
    id: 4,
    documentId: "comment-4",
    content:
      "برای اولین بار خریدم و روند سفارش خیلی ساده بود. حتما دوباره استفاده می‌کنم.",
    comment_status: "approved",
    users_permissions_user: { id: 104, username: "سارا" },
  },
  {
    id: 5,
    documentId: "comment-5",
    content:
      "تجربه خوبی بود اما لطفا گزینه‌های بیشتری برای سفارش اضافه کنید.",
    comment_status: "rejected",
    users_permissions_user: { id: 105, username: "نیما" },
  },
  {
    id: 6,
    documentId: "comment-6",
    content:
      "همه چیز خوب بود، فقط دوست داشتم جزئیات بیشتری درباره محصول ببینم.",
    comment_status: "approved",
    users_permissions_user: null,
  },
]

export function CommentsSection() {
  return (
    <Card className="text-right">
      <CardHeader>
        <CardTitle>نظرات کاربران</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fakeComments.map((comment, index) => (
          <div key={comment.documentId ?? comment.id} className="space-y-6">
            <CommentItem comment={comment} />
            {index < fakeComments.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
