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
    createTodo: {
      method: "POST",
      path: "/todo/create",
      body: c.type<{ text: string }>(),
      responses: {
        200: c.type<{ status: string }>(),
      },
      summary: "Create a Todo",
    },
    signUp: {
      method: "POST",
      path: "/auth/sign-up",
      body: c.type<{ email: string; password: string }>(),
      responses: {
        200: c.type<{ status: string }>(),
      },
      summary: "Sign up",
    }
  },
  {
    pathPrefix: "/api",
  },
);
