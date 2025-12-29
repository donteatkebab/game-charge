// src/utils/sms.ts

export async function sendSMS(phone: string, message: string) {
  console.log("------------ TEST OTP SMS ------------")
  console.log("Sending SMS to:", phone)
  console.log("OTP Code:", message)
  console.log("--------------------------------------")

  // Simulate async delay
  return new Promise((resolve) => setTimeout(resolve, 200))
}
