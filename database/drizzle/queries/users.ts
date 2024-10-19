import {
  and,
  eq,
  SQL,
} from "drizzle-orm";

import { type dbSqlite } from "../db";
import { usersTable } from "../schema/users";

export function insertUser(db: ReturnType<typeof dbSqlite>, email: string, password: string) {
  return db.insert(usersTable).values({ email, password });
}

export function getUser(db: ReturnType<typeof dbSqlite>) {
  return db.select().from(usersTable).all();
}

export function getUserByEmail(db: ReturnType<typeof dbSqlite>, email: string) {
  const filters: SQL[] = [];
  filters.push(eq(usersTable.email, email));

  return db
    .select()
    .from(usersTable)
    .where(and(...filters))
    .all();
}
