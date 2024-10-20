import type {
  Session,
  User,
} from "lucia";
import {
  generateId,
  Scrypt,
  verifyRequestOrigin,
} from "lucia";

import * as drizzleQueries from "@/database/drizzle/queries/lucia-auth";
import {
  type DatabaseUser,
  initializeLucia,
} from "@/lib/lucia-auth";
// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import {
  type Get,
  type UniversalMiddleware,
} from "@universal-middleware/core";

import { signUpValidator } from "./validators/user";

/**
 * Add lucia database to the context
 *
 * @link {@see https://universal-middleware.dev/examples/context-middleware}
 */
export const luciaDbMiddleware: Get<[], UniversalMiddleware> = () => async (_request, context, _runtime) => {
  const lucia = initializeLucia(context.db);
  return {
    ...context,
    lucia,
  };
};

/**
 * CSRF protection middleware
 *
 * @link {@see https://lucia-auth.com/guides/validate-session-cookies/}
 */
export const luciaCsrfMiddleware = (() => async (request) => {
  if (request.method === "GET") {
    return;
  }
  const originHeader = request.headers.get("Origin") ?? null;
  const hostHeader = request.headers.get("Host") ?? null;

  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new Response("Forbidden Request", {
      status: 403,
    });
  }
}) satisfies Get<[], UniversalMiddleware>;

/**
 * Validate session cookies middleware and set context
 *
 * @link {@see https://lucia-auth.com/guides/validate-session-cookies/}
 */
export const luciaAuthContextMiddleware: Get<[], UniversalMiddleware> = () => async (request, context) => {
  const sessionId = context.lucia.readSessionCookie(request.headers.get("cookie") ?? "");

  if (!sessionId) {
    return {
      ...context,
      session: null,
      user: null,
    };
  } else {
    const { session, user } = await context.lucia.validateSession(sessionId);

    return {
      ...context,
      sessionId,
      session,
      user,
    };
  }
};

/**
 * Set Set-Cookie headers if in context
 */
export const luciaAuthCookieMiddleware = (() => (_request, context) => {
  return (response: Response) => {
    if (context.session?.fresh) {
      response.headers.append("Set-Cookie", context.lucia.createSessionCookie(context.session.id).serialize());
    }
    if (context.sessionId && !context.session) {
      response.headers.append("Set-Cookie", context.lucia.createBlankSessionCookie().serialize());
    }

    return response;
  };
}) satisfies Get<
  [],
  UniversalMiddleware<Universal.Context & { session?: Session | null; user?: User | null; sessionId?: string | null }>
>;

/**
 * Register user handler
 *
 * @link {@see https://lucia-auth.com/guides/email-and-password/basics#register-user}
 */
export const luciaAuthSignupHandler = (() => async (request, context, _runtime) => {
  // getting "SyntaxError: Unexpected end of JSON input" error
  // here is fix:
  const contentType = request.headers.get("content-type") ?? "";
  console.log("contentType", contentType);

  if (!contentType.includes("application/json")) {
    return new Response(JSON.stringify({ error: { invalid: "Invalid content type" } }), {
      status: 422,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  console.log("request.body", request);
  console.log("signup starting");
  const requestData = await request.json();
  console.log("requestData", requestData);
  const body = requestData as { email: string; password: string; walletAddress: string };
  console.log("request.json passes");
  const email = body.email ?? "";
  const password = body.password ?? "";
  const walletAddress = body.walletAddress ?? "";

  console.log("userpass", { email, password });
  console.log("body", body);

  const validated = signUpValidator.safeParse({ email, password, walletAddress });

  console.log("validated", validated);

  if (validated.error) {
    return new Response(JSON.stringify({ error: validated.error }), {
      status: 422,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  /**
   * A pure JS implementation of Scrypt.
   * It's portable but slower than implementations based on native code.
   *
   * @link {@see https://lucia-auth.com/reference/main/Scrypt}
   * @link {@see https://lucia-auth.com/guides/email-and-password/basics#hashing-passwords}
   */
  const scrypt = new Scrypt();
  const passwordHash = await scrypt.hash(password);

  const userId = generateId(15);

  try {
    await drizzleQueries.signupWithCredentials(context.db, userId, walletAddress, email, passwordHash);

    console;
    const session = await context.lucia.createSession(userId, {});

    return new Response(JSON.stringify({ status: "success" }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": context.lucia.createSessionCookie(session.id).serialize(),
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error: { invalid: "An unknown error has occurred" } }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}) satisfies Get<[], UniversalMiddleware>;

/**
 * Sign in user handler
 *
 * @link {@see https://lucia-auth.com/guides/email-and-password/basics#sign-in-user}
 */
export const luciaAuthLoginHandler = (() => async (request, context, _runtime) => {
  const body = (await request.json()) as { email: string; password: string };
  const email = body.email ?? "";
  const password = body.password ?? "";

  console.log("userpass", { email, password });

  const validated = signUpValidator.safeParse({ email, password });

  if (validated.error) {
    return new Response(JSON.stringify({ error: validated.error }), {
      status: 422,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const existingUser: DatabaseUser | undefined | null = await drizzleQueries.getExistingUser(context.db, email);

  if (!existingUser) {
    return new Response(JSON.stringify({ error: { invalid: "Incorrect email or password" } }), {
      status: 422,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const scrypt = new Scrypt();
  const validPassword = existingUser.password && (await scrypt.verify(existingUser.password, password));

  if (!validPassword) {
    return new Response(JSON.stringify({ error: { invalid: "Incorrect email or password" } }), {
      status: 422,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const session = await context.lucia.createSession(existingUser.id, {});

  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": context.lucia.createSessionCookie(session.id).serialize(),
    },
  });
}) satisfies Get<[], UniversalMiddleware>;

/**
 * Log out user handler
 */
export const luciaAuthLogoutHandler = (() => async (_request, context) => {
  const session = context.session ?? null;

  if (!session) {
    return new Response("Unauthorized Request", {
      status: 401,
    });
  }
  /**
   * Invalidate sessions
   *
   * @link {@see https://lucia-auth.com/basics/sessions#invalidate-sessions}
   */
  await context.lucia.invalidateSession(session.id);

  /**
   * Delete session cookie
   *
   * @link {@see https://lucia-auth.com/basics/sessions#delete-session-cookie}
   */
  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: {
      "set-cookie": context.lucia.createBlankSessionCookie().serialize(),
    },
  });
}) satisfies Get<[], UniversalMiddleware<Universal.Context & { session?: Session | null }>>;
