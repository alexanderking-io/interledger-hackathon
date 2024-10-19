import { getUserByEmail } from "@/database/drizzle/queries/users";
import {
  Auth,
  type AuthConfig,
  createActionURL,
  setEnvDefaults,
} from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import type {
  Session,
  User,
} from "@auth/core/types";
// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type {
  Get,
  UniversalHandler,
  UniversalMiddleware,
} from "@universal-middleware/core";

import { verifyUser } from "./utils/auth";
import { db } from "./utils/db";
import { userValidator } from "./validators/user";

const env: Record<string, string | undefined> =
  typeof process?.env !== "undefined"
    ? process.env
    : import.meta && "env" in import.meta
      ? (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env
      : {};

if (!globalThis.crypto) {
  /**
   * Polyfill needed if Auth.js code runs on node18
   */
  Object.defineProperty(globalThis, "crypto", {
    value: await import("node:crypto").then((crypto) => crypto.webcrypto as Crypto),
    writable: false,
    configurable: true,
  });
}

const authjsConfig = {
  basePath: "/api/auth",
  trustHost: Boolean(env.AUTH_TRUST_HOST ?? env.VERCEL ?? env.NODE_ENV !== "production"),
  // TODO: Replace secret {@see https://authjs.dev/reference/core#secret}
  secret: "MY_SECRET",
  providers: [
    // TODO: Choose and implement providers
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(request) {
        const user = userValidator.safeParse(request);
        if (!user.success) return null;

        const result = await verifyUser(user.data.email, user.data.email);
        if (!result) return null;

        const userFromDB = await getUserByEmail(db, user.data.email);
        if (!userFromDB.length) return null;

        const userDetails: User = { id: `${userFromDB[0].id}`, email: userFromDB[0].email };

        return userDetails;
      },
    }),
  ],
} satisfies Omit<AuthConfig, "raw">;

/**
 * Retrieve Auth.js session from Request
 */
export async function getSession(req: Request, config: Omit<AuthConfig, "raw">): Promise<Session | null> {
  setEnvDefaults(process.env, config);
  const requestURL = new URL(req.url);
  const url = createActionURL("session", requestURL.protocol, req.headers, process.env, config);

  const response = await Auth(new Request(url, { headers: { cookie: req.headers.get("cookie") ?? "" } }), config);

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}

/**
 * Add Auth.js session to context
 * @link {@see https://authjs.dev/getting-started/session-management/get-session}
 **/
export const authjsSessionMiddleware: Get<[], UniversalMiddleware> = () => async (request, context) => {
  try {
    return {
      ...context,
      session: await getSession(request, authjsConfig),
    };
  } catch (error) {
    console.debug("authjsSessionMiddleware:", error);
    return {
      ...context,
      session: null,
    };
  }
};

/**
 * Auth.js route
 * @link {@see https://authjs.dev/getting-started/installation}
 **/
export const authjsHandler = (() => async (request) => {
  return Auth(request, authjsConfig);
}) satisfies Get<[], UniversalHandler>;
