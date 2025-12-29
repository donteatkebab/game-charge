export default {
  routes: [
    {
      method: "POST",
      path: "/payment/request",
      handler: "payment.request",
    },
    {
      method: "GET",
      path: "/payment/verify",
      handler: "payment.verify",
    },
  ],
}
