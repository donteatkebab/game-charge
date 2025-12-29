export default {
  routes: [
    {
      method: "POST",
      path: "/auth/otp/request",
      handler: "api::otp.otp.request",
      config: { auth: false },
    },
    {
      method: "POST",
      path: "/auth/otp/verify",
      handler: "api::otp.otp.verify",
      config: { auth: false },
    },
  ],
}
