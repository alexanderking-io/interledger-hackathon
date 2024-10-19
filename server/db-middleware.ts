import type { Get, UniversalMiddleware } from "@universal-middleware/core";
import { dbSqlite } from "../database/drizzle/db";
import { db } from "./utils/db";

declare global {
  namespace Universal {
    interface Context {
      db: ReturnType<typeof dbSqlite>;
    }
  }
}

// Add `db` to the Context
export const dbMiddleware: Get<[], UniversalMiddleware> = () => async (_request, context, _runtime) => {
  return {
    ...context,
    db: db,
  };
};
