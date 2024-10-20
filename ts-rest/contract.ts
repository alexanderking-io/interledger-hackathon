import { initContract } from "@ts-rest/core";

const c = initContract();

/**
 * ts-rest contract
 *
 * Create a contract, this should ideally be shared between your consumers and producers
 * Think of this as your HTTP Schema that both your client and backend can use.
 * @link {@see https://ts-rest.com/docs/core/}
 **/
export const contract = c.router(
  {
    demo: {
      method: "GET",
      path: "/demo",
      responses: {
        200: c.type<{ demo: boolean }>(),
      },
    },
    initiatePaymentRoute: {
      method: "GET",
      path: "/initiate-payment",
      query: c.type<{ serviceType: string }>(),
      responses: {
        200: c.type<{ status: string; res: string }>(),
      },
      summary: "Initiate a payment",
    },
    completePaymentRoute: {
      method: "GET",
      path: "/complete-payment",
      query: c.type<{ interact_ref?: string }>(),
      responses: {
        200: c.type<{ status: string; success: Boolean }>(),
        400: c.type<{ status: string }>(),
      },
      summary: "Complete a payment",
    },
    recurringPaymentRoute: {
      method: "GET",
      path: "/recurring-payment",
      query: c.type<{ serviceType?: string }>(),
      responses: {
        200: c.type<{ status: string; success: Boolean }>(),
      },
      summary: "Recurring payment",
    }
  },
  {
    pathPrefix: "/api",
  },
);
