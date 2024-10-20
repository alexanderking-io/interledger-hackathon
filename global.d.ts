import { Session } from "@auth/core/types";
import { dbSqlite } from "./database/drizzle/db";

declare global {
  namespace Vike {
    interface PageContext {
      user?: User;
      db: ReturnType<typeof dbSqlite>;
    }
  }
}

declare global {
  namespace Vike {
    interface PageContext {
      session?: Session | null;
    }
  }
}

export {};
