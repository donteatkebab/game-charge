"use client"

import * as React from "react"
import { ArrowLeft, GalleryVerticalEnd, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Link from "next/link"

type Step = "request" | "verify"

export function OtpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = React.useState<Step>("request")
  const [phone, setPhone] = React.useState("")
  const [code, setCode] = React.useState("")

  // UI-only countdown (no server calls)
  const [secondsLeft, setSecondsLeft] = React.useState<number>(0)

  React.useEffect(() => {
    if (step !== "verify") return
    if (secondsLeft <= 0) return

    const t = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)

    return () => window.clearInterval(t)
  }, [step, secondsLeft])

  function startCountdown() {
    setSecondsLeft(60)
  }

  function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    // فقط UI: اینجا بعدا به /auth/otp/request وصل می‌کنی
    setStep("verify")
    startCountdown()
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    // فقط UI: اینجا بعدا به /auth/otp/verify وصل می‌کنی
    // فعلا هیچ کاری نمی‌کنیم
  }

  function resetToRequest() {
    setStep("request")
    setCode("")
    setSecondsLeft(0)
  }

  const canResend = secondsLeft === 0

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={step === "request" ? handleRequest : handleVerify}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Game Charge</span>
            </a>

            <h1 className="text-xl font-bold">ورود به حساب کاربری</h1>
            <FieldDescription>
              {step === "request"
                ? "شماره موبایل را وارد کنید تا کد یکبار مصرف ارسال شود."
                : "کد ارسال شده را وارد کنید."}
            </FieldDescription>
          </div>

          {step === "request" ? (
            <>
              <Field>
                <FieldLabel htmlFor="phone">شماره موبایل</FieldLabel>
                <Input
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="مثلا 09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <FieldDescription>
                  فعلا نمایشی است و به سرور وصل نشده.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  ارسال کد
                </Button>
              </Field>

              <FieldSeparator>یا</FieldSeparator>

              <Field>
                <Button asChild variant="outline" type="button">
                  <Link href="/">
                    بازگشت به خانه
                  </Link>
                </Button>
              </Field>
            </>
          ) : (
            <>
              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="otp">کد یکبار مصرف</FieldLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetToRequest}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    تغییر شماره
                  </Button>
                </div>

                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                >
                  <InputOTPGroup dir="ltr" className="justify-center grow">
                    <InputOTPSlot className="grow" index={0} />
                    <InputOTPSlot className="grow" index={1} />
                    <InputOTPSlot className="grow" index={2} />
                    <InputOTPSlot className="grow" index={3} />
                    <InputOTPSlot className="grow" index={4} />
                    <InputOTPSlot className="grow" index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <FieldDescription>
                  ارسال به شماره: <span className="font-medium">{phone || "(نامشخص)"}</span>
                </FieldDescription>
              </Field>

              <Field className="grid gap-3 sm:grid-cols-2">
                <Button type="submit" className="w-full">
                  ورود
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  disabled={!canResend}
                  onClick={() => {
                    // فقط UI: اینجا بعدا دوباره /auth/otp/request
                    startCountdown()
                  }}
                >
                  <RefreshCw className="size-4" />
                  {canResend ? "ارسال مجدد" : `ارسال مجدد تا ${secondsLeft}s`}
                </Button>
              </Field>
            </>
          )}
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        با ورود، شما <a href="#">قوانین</a> و <a href="#">حریم خصوصی</a> را می‌پذیرید.
      </FieldDescription>
    </div>
  )
}

export default OtpForm
