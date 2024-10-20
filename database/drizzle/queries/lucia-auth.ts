import {
  and,
  eq,
} from "drizzle-orm";

import { dbSqlite } from "../db";
import {
  oauthAccountTable,
  userTable,
} from "../schema/lucia-auth";

export async function getExistingUser(db: ReturnType<typeof dbSqlite>, email: string) {
  return db.select().from(userTable).where(eq(userTable.email, email)).get();
}

export async function getExistingAccount(db: ReturnType<typeof dbSqlite>, providerId: string, providerUserId: number) {
  return db
    .select()
    .from(oauthAccountTable)
    .where(and(eq(oauthAccountTable.providerId, providerId), eq(oauthAccountTable.providerUserId, providerUserId)))
    .get();
}

export async function signupWithCredentials(
  db: ReturnType<typeof dbSqlite>,
  userId: string,
  email: string,
  walletAddress: string,
  passwordHash: string,
) {
  return db.insert(userTable).values({ id: userId, email, walletAddress, password: passwordHash }).run();
}
