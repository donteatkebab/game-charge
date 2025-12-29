import axios from "axios"

const ZIBAL_MERCHANT = process.env.ZIBAL_MERCHANT || ""
const BACKEND_BASE = process.env.PUBLIC_URL || "http://localhost:1337"
const FRONTEND_BASE = process.env.FRONTEND_URL || "http://localhost:3000"

const zibal = {
  async request(amount: number, orderId: string) {
    const res = await axios.post("https://gateway.zibal.ir/v1/request", {
      merchant: ZIBAL_MERCHANT,
      amount,
      callbackUrl: `${BACKEND_BASE}/api/payment/verify?order=${orderId}`,
    })
    const data = res.data
    if (data?.result !== 100 || !data?.trackId) {
      throw new Error(`Zibal request failed: ${JSON.stringify(data)}`)
    }
    return {
      trackId: data.trackId,
      redirectUrl: `https://gateway.zibal.ir/start/${data.trackId}`,
    }
  },
  async verify(trackId: string) {
    const res = await axios.post("https://gateway.zibal.ir/v1/verify", {
      merchant: ZIBAL_MERCHANT,
      trackId,
    })
    const data = res.data
    const success = data?.result === 100
    return { success, raw: data }
  },
}

export default {
  async request(ctx) {
    const user = ctx.state.user
    if (!user) return ctx.unauthorized("Login required")

    const { orderDocumentId } = ctx.request.body as {
      orderDocumentId?: string
    }

    if (!orderDocumentId) {
      return ctx.badRequest("orderDocumentId is required")
    }

    const order = await strapi.documents("api::order.order").findOne({
      documentId: orderDocumentId,
      populate: { users_permissions_user: true },
    })
    if (!order) return ctx.notFound("Order not found")

    if (
      !order.users_permissions_user ||
      order.users_permissions_user.id !== user.id
    ) {
      return ctx.forbidden("You do not own this order")
    }

    if (order.order_status && order.order_status !== "pending") {
      return ctx.badRequest("Order is not payable")
    }

    const amount = typeof order.amount === "number" ? order.amount : 0
    if (amount <= 0) {
      return ctx.badRequest("Order amount is invalid")
    }

    if (!ZIBAL_MERCHANT) {
      return ctx.badRequest("No payment gateway is available")
    }

    try {
      const { trackId, redirectUrl } = await zibal.request(
        amount,
        order.documentId
      )

      const trackIdStr = trackId != null ? String(trackId) : undefined

      const nextNotesAdmin = trackIdStr
        ? [order.notes_admin, `payment_track_id:${trackIdStr}`]
          .filter(Boolean)
          .join("\n")
        : order.notes_admin

      await strapi.documents("api::order.order").update({
        documentId: order.documentId,
        data: {
          order_status: "pending",
          payment_gateway: "zibal",
          payment_track_id: trackIdStr,
          notes_admin: nextNotesAdmin,
        },
      })

      ctx.send({ redirectUrl, trackId })
    } catch (err) {
      strapi.log.error("Payment request failed", err)
      ctx.throw(500, "Failed to initiate payment")
    }
  },

  async verify(ctx) {
    const orderDocumentId = ctx.query?.order as string | undefined
    if (!orderDocumentId) {
      return ctx.badRequest("Invalid verification request")
    }

    const order = await strapi
      .documents("api::order.order")
      .findOne({ documentId: orderDocumentId, populate: { users_permissions_user: true } })
    if (!order) return ctx.notFound("Order not found")

    if (order.order_status === "processing" || order.order_status === "done") {
      return ctx.redirect(
        `${FRONTEND_BASE}/payment/result?order=${order.documentId}&status=success`
      )
    }
    if (order.order_status === "rejected" || order.order_status === "cancelled") {
      return ctx.redirect(
        `${FRONTEND_BASE}/payment/result?order=${order.documentId}&status=fail`
      )
    }

    try {
      const incomingTrackId = ctx.query?.trackId as string | undefined
      const trackId = String(incomingTrackId || order.payment_track_id || "")
      if (!trackId) return ctx.badRequest("trackId missing")

      const result = await zibal.verify(trackId)
      const success = result.success

      await strapi.documents("api::order.order").update({
        documentId: order.documentId,
        data: {
          payment_gateway: "zibal",
          payment_track_id: trackId,
          order_status: success ? "processing" : "rejected",
          ...(success ? { paid_at: new Date().toISOString() } : {}),
        },
      })

      const redirectUrl = `${FRONTEND_BASE}/payment/result?order=${order.documentId}&status=${success ? "success" : "fail"
        }`

      ctx.redirect(redirectUrl)
    } catch (err: any) {
      strapi.log.error("Payment verify failed", err)
      ctx.redirect(
        `${FRONTEND_BASE}/payment/result?order=${orderDocumentId}&status=fail`
      )
    }
  },
}
