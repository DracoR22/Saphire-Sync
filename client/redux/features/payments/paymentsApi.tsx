import { apiSlice } from "../api/apiSlice";

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // GET STRIPE PUBLISHABLE KEY
        getStripePublishablekey: builder.query({
            query: () => ({
              url: `payment/stripepublishablekey`,
              method: "GET",
              credentials: "include" as const,
            }),
          }),
          // CREATE THE PAYMENT
          createPaymentIntent: builder.mutation({
            query: (amount) => ({
              url: "payment",
              method: "POST",
              body: {
                amount,
              },
              credentials: "include" as const,
            }),
          }),
    })
})

export const { useGetStripePublishablekeyQuery, useCreatePaymentIntentMutation } = paymentsApi