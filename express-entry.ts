import "dotenv/config";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import session from "express-session";

import {
  createHandler,
  createMiddleware,
} from "@universal-middleware/express";

import { dbMiddleware } from "./server/db-middleware";
import {
  luciaAuthContextMiddleware,
  luciaAuthCookieMiddleware,
  luciaAuthLoginHandler,
  luciaAuthLogoutHandler,
  luciaAuthSignupHandler,
  luciaCsrfMiddleware,
  luciaDbMiddleware,
  luciaGithubCallbackHandler,
  luciaGithubLoginHandler,
} from "./server/lucia-auth-handlers";
import { tsRestHandler } from "./server/ts-rest-handler";
import { vikeHandler } from "./server/vike-handler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678;

export default (await startServer()) as unknown;

async function startServer() {
  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(`${root}/dist/client`));
  } else {
    // Instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We should instantiate it *only* in development. (It isn't needed in production
    // and would unnecessarily bloat our server in production.)
    const vite = await import("vite");
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true, hmr: { port: hmrPort } },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.use(createMiddleware(dbMiddleware)());
  app.use(express.json());

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  app.use(createMiddleware(luciaDbMiddleware)());
  app.use(createMiddleware(luciaCsrfMiddleware)());
  app.use(createMiddleware(luciaAuthContextMiddleware)());
  app.use(createMiddleware(luciaAuthCookieMiddleware)());

  app.post("/api/signup", createHandler(luciaAuthSignupHandler)());
  app.post("/api/login", createHandler(luciaAuthLoginHandler)());
  app.post("/api/logout", createHandler(luciaAuthLogoutHandler)());
  app.get("/api/login/github", createHandler(luciaGithubLoginHandler)());
  app.get("/api/login/github/callback", createHandler(luciaGithubCallbackHandler)());

  app.all("/api/*", createHandler(tsRestHandler)());

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all("*", createHandler(vikeHandler)());

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  return app;
}
