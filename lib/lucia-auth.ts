import "dotenv/config";

import {
  Lucia,
  type Register,
} from "lucia";

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { dbSqlite } from "../database/drizzle/db";
import {
  sessionTable,
  userTable,
} from "../database/drizzle/schema/lucia-auth";

/**
 * Polyfill needed if you're using Node.js 18 or below
 *
 * @link {@see https://lucia-auth.com/getting-started/#polyfill}
 */
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: await import("node:crypto").then((crypto) => crypto.webcrypto as Crypto),
    writable: false,
    configurable: true,
  });
}

export function initializeLucia(db: ReturnType<typeof dbSqlite>) {
  /**
   * Database setup
   *
   * @link {@see https://lucia-auth.com/database/#database-setup}
   **/
  const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

  /**
   * Initialize Lucia
   *
   * @link {@see https://lucia-auth.com/getting-started/#initialize-lucia}
   */
  return new Lucia(adapter, {
    /**
     * Lucia Configuration
     *
     * @link {@see https://lucia-auth.com/basics/configuration}
     */
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        walletAddress: attributes.walletAddress,
      };
    },
  });
}

/**
 * Define user attributes
 *
 * @link {@see https://lucia-auth.com/basics/users#define-user-attributes}
 */
declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}

declare global {
  namespace Universal {
    interface Context {
      lucia: Register["Lucia"];
      db: ReturnType<typeof dbSqlite>;
    }
  }
}

export interface DatabaseUser {
  id: string;
  email: string;
  walletAddress: string;
  password?: string | null;
}

export interface DatabaseOAuthAccount {
  providerId: string;
  providerUserId: string;
  userId: string;
}
