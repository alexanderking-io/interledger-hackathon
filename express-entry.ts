import "dotenv/config";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import http from 'http';
import { id, createClient } from 'tigerbeetle-node';
import express from "express";

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
const expressPort = process.env.EX_PORT ? parseInt(process.env.EX_PORT, 10) : 5000;

// Create Tiger Beetle client
const clientTiger = createClient({
    cluster_id: 0n,
    replica_addresses: [process.env.TB_ADDRESS || "3001"],
  });
  

// Helper function to handle responses
const sendResponse = (res: http.ServerResponse, statusCode: number, data: any) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// Create HTTP server
const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.method === 'POST' && req.url === '/api/accounts') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    req.on('end', async () => {
      try {
        const { name } = JSON.parse(body);
        const accountId = id(); // Generate a new unique ID
        const account = { id: accountId, name ,  debits_pending: 0n,
            debits_posted: 0n,
            credits_pending: 0n,
            credits_posted: 0n,
            user_data_128: 0n,
            user_data_64: 0n,
            user_data_32: 0,
            reserved: 0,
            ledger: 1,
            code: 718,
            flags: 0,
            timestamp: 0n,
          };

        await clientTiger.createAccounts([account]);
        sendResponse(res, 201, { id: accountId });
      } catch (error) {
        console.error('Error creating account:', error);
        sendResponse(res, 500, { error: 'Failed to create account' });
      }
    });

  } else if (req.method === 'GET' && req.url === '/api/accounts') {
    try {
      const accounts = await clientTiger.lookupAccounts([100n, 101n]);
      sendResponse(res, 200, accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      sendResponse(res, 500, { error: 'Failed to fetch accounts' });
    }

  } else if (req.method === 'POST' && req.url === '/api/transfers') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { sourceAccountId, destinationAccountId, amount } = JSON.parse(body);
        const transfer = {
          id: id(), // Generate a unique transfer ID
          source_account_id: sourceAccountId,
          destination_account_id: destinationAccountId,
          amount, debit_account_id: 102n,
          credit_account_id: 103n,
          pending_id: 0n,
          user_data_128: 0n,
          user_data_64: 0n,
          user_data_32: 0,
          timeout: 0,
          ledger: 1,
          code: 720,
          flags: 0,
          timestamp: 0n,
        };

        await clientTiger.createTransfers([transfer]);
        sendResponse(res, 201, { id: transfer.id });
      } catch (error) {
        console.error('Error creating transfer:', error);
        sendResponse(res, 500, { error: 'Failed to create transfer' });
      }
    });

  } 
   else {
    sendResponse(res, 404, { error: 'Not Found' });
  }
});


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

  // Start the server
  server.listen(expressPort, () => {
  console.log(`Server running at http://localhost:${port}`);
});

  return app;
}
