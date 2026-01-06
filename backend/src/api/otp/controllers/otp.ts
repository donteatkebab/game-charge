import { factories } from "@strapi/strapi"
import { createHash, randomInt } from "crypto"
import { addMinutes, isAfter, startOfDay, endOfDay } from "date-fns"
import { sendSMS } from "../../../utils/sms"

const OTP_TTL_MINUTES = 3
const OTP_COOLDOWN_MS = 60_000
const MAX_OTP_PER_PHONE_PER_DAY = 10
const MAX_VERIFY_ATTEMPTS = 3
const LOCKOUT_MS = 5 * 60_000

export default factories.createCoreController("api::otp.otp", ({ strapi }) => {
  const ipLockUntil = new Map<string, number>()
  const ipVerifyAttempts = new Map<string, number>()
  const ipLastRequestAt = new Map<string, number>()
  const IP_REQUEST_COOLDOWN_MS = 3_000

  const makePhoneIpKey = (ip: string, phone: string) => `${ip}:${phone}`

  const isKeyLocked = (key: string) => {
    const lockedUntil = ipLockUntil.get(key) || 0
    const remainingMs = lockedUntil - Date.now()
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0
  }

  const lockKey = (key: string) => {
    ipLockUntil.set(key, Date.now() + LOCKOUT_MS)
    ipVerifyAttempts.delete(key)
  }

  const bumpVerifyAttempts = (key: string) => {
    const next = (ipVerifyAttempts.get(key) || 0) + 1
    ipVerifyAttempts.set(key, next)
    return next
  }

  const resetVerifyAttempts = (key: string) => {
    ipVerifyAttempts.delete(key)
  }

  const OTP_SECRET = process.env.OTP_SECRET
  if (!OTP_SECRET) {
    throw new Error("OTP_SECRET is not configured")
  }

  const hashCode = (code: string) => {
    return createHash("sha256").update(`${code}:${OTP_SECRET}`).digest("hex")
  }

  const findRecentOtps = async (phone: string) => {
    const rows = await strapi.documents("api::otp.otp").findMany({
      filters: { phone },
      sort: { createdAt: "desc" },
      limit: 10,
    })
    return rows
  }

  const getIp = (ctx) => ctx.request?.ip || ctx.ip || "unknown"

  const respondWithCooldown = (ctx, retryAfter: number, code = "COOLDOWN_ACTIVE") => {
    ctx.set("Retry-After", retryAfter.toString())
    ctx.status = 429
    return ctx.send({
      error: { code, message: "لطفا چند لحظه دیگر دوباره درخواست دهید." },
      retry_after: retryAfter,
    })
  }

  const respondDailyLimit = (ctx, retryAfter: number) => {
    ctx.set("Retry-After", retryAfter.toString())
    ctx.status = 429
    return ctx.send({
      error: {
        code: "DAILY_LIMIT_REACHED",
        message:
          "حداکثر تعداد دریافت کد برای امروز تکمیل شده است. لطفا فردا دوباره تلاش کنید.",
      },
      retry_after: retryAfter,
    })
  }

  const respondLocked = (ctx, retryAfter: number) => {
    ctx.set("Retry-After", retryAfter.toString())
    ctx.status = 429
    return ctx.send({
      error: {
        code: "IP_LOCKED",
        message:
          "به دلیل تلاش‌های متعدد، آی‌پی شما موقتا مسدود شده است. لطفا بعدا تلاش کنید.",
      },
      retry_after: retryAfter,
    })
  }

  const respondUnauthorized = (ctx, message: string, code = "UNAUTHORIZED") => {
    ctx.status = 401
    return ctx.send({ error: { code, message } })
  }

  return {
    async request(ctx) {
      const { phone } = ctx.request.body

      if (!phone || !/^09\d{9}$/.test(phone)) {
        return ctx.badRequest("شماره موبایل نامعتبر است.")
      }

      const ip = getIp(ctx)

      const lastIpReq = ipLastRequestAt.get(ip) || 0
      const ipDiff = Date.now() - lastIpReq
      if (ipDiff < IP_REQUEST_COOLDOWN_MS) {
        const retryAfter = Math.ceil((IP_REQUEST_COOLDOWN_MS - ipDiff) / 1000)
        return respondWithCooldown(ctx, retryAfter)
      }
      ipLastRequestAt.set(ip, Date.now())

      const key = makePhoneIpKey(ip, phone)
      const lockedFor = isKeyLocked(key)
      if (lockedFor > 0) {
        return respondLocked(ctx, lockedFor)
      }

      const recentRows = await findRecentOtps(phone)
      const recent = recentRows[0]
      if (recent) {
        const diff = Date.now() - new Date(recent.createdAt).getTime()
        if (diff < OTP_COOLDOWN_MS) {
          const retryAfter = Math.ceil((OTP_COOLDOWN_MS - diff) / 1000)
          return respondWithCooldown(ctx, retryAfter)
        }
      }

      const now = new Date()
      const from = startOfDay(now).toISOString()
      const to = endOfDay(now).toISOString()

      const todaysOtps = await strapi.documents("api::otp.otp").findMany({
        filters: {
          phone,
          createdAt: {
            $gte: from,
            $lte: to,
          },
        },
        limit: MAX_OTP_PER_PHONE_PER_DAY + 1,
      })

      if (todaysOtps.length >= MAX_OTP_PER_PHONE_PER_DAY) {
        const retryAfter = Math.ceil(
          (endOfDay(now).getTime() - now.getTime()) / 1000,
        )
        return respondDailyLimit(ctx, retryAfter)
      }

      const code = randomInt(100000, 999999).toString()
      const expiresAt = addMinutes(new Date(), OTP_TTL_MINUTES)
      const codeHash = hashCode(code)

      try {
        await sendSMS(phone, code)
        await strapi.documents("api::otp.otp").create({
          data: {
            codeHash,
            expiresAt,
            phone,
            used: false,
          },
        })
      } catch (error) {
        strapi.log.error("SMS send failed", error)
        ctx.status = 502
        return ctx.send({
          error: { code: "SMS_FAILED", message: "ارسال پیامک با خطا مواجه شد." },
        })
      }

      ctx.send({ ok: true })
    },

    async verify(ctx) {
      const { phone, code } = ctx.request.body

      if (!phone || !/^09\d{9}$/.test(phone)) {
        return ctx.badRequest("شماره موبایل نامعتبر است.")
      }

      if (!code || typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
        return ctx.badRequest("کد وارد شده معتبر نیست.")
      }

      const ip = getIp(ctx)
      const key = makePhoneIpKey(ip, phone)
      const lockedFor = isKeyLocked(key)
      if (lockedFor > 0) {
        return respondLocked(ctx, lockedFor)
      }

      const otps = await findRecentOtps(phone)
      const now = new Date()

      // mark obviously expired unused OTPs as used to keep things tidy
      for (const row of otps) {
        if (!row.used && row.expiresAt && isAfter(now, new Date(row.expiresAt))) {
          await strapi.documents("api::otp.otp").update({
            documentId: row.documentId,
            data: { used: true },
          })
        }
      }

      const codeHash = hashCode(code)
      const match = otps.find(
        (row) =>
          !row.used &&
          row.codeHash === codeHash &&
          row.expiresAt &&
          !isAfter(now, new Date(row.expiresAt))
      )

      if (!match) {
        const attempts = bumpVerifyAttempts(key)
        if (attempts >= MAX_VERIFY_ATTEMPTS) {
          lockKey(key)
          return respondLocked(ctx, Math.ceil(LOCKOUT_MS / 1000))
        }
        return respondUnauthorized(ctx, "کد یا شماره اشتباه است.", "INVALID_CODE")
      }

      await strapi.documents("api::otp.otp").update({
        documentId: match.documentId,
        data: { used: true },
      })
      resetVerifyAttempts(key)

      const users = await strapi
        .documents("plugin::users-permissions.user")
        .findMany({ filters: { phone }, populate: { role: true } })

      let user = users[0]

      // fetch authenticated/default role (type = "authenticated")
      const roles = await strapi
        .documents("plugin::users-permissions.role")
        .findMany({ filters: { type: "authenticated" }, limit: 1 })
      const defaultRole = roles[0]

      if (!user) {
        user = await strapi.documents("plugin::users-permissions.user").create({
          data: {
            username: phone,
            phone,
            provider: "sms",
            email: `${phone}@sms.local`,
            confirmed: true,
            role: defaultRole?.id,
            first_name: "کاربر",
            last_name: phone.slice(-4),
          },
        })
      } else if (!user.role && defaultRole?.id) {
        // ensure existing user has a role
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: {
            role: defaultRole.id,
          },
        })
        // refetch with role connected
        const updated = await strapi
          .documents("plugin::users-permissions.user")
          .findOne({ documentId: user.documentId, populate: { role: true } })
        user = updated ?? user
      }

      const jwtService = strapi.service("plugin::users-permissions.jwt")
      const token = jwtService.issue({ id: user.id })

      ctx.send({
        jwt: token,
        user: {
          id: user.id,
          documentId: user.documentId,
          username: user.username,
          phone: user.phone,
          role: user.role ? { id: user.role.id, name: user.role.name, type: user.role.type } : undefined,
        },
      })
    },
  }
})
