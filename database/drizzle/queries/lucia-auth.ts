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

export async function signupWithGithub(
  db: ReturnType<typeof dbSqlite>,
  userId: string,
  email: string,
  githubUserId: number,
) {
  return db.transaction(async (tx) => {
    await tx.insert(userTable).values({ id: userId, email: email });
    await tx.insert(oauthAccountTable).values({ providerId: "github", providerUserId: githubUserId, userId });
  });
}

export async function signupWithCredentials(
  db: ReturnType<typeof dbSqlite>,
  userId: string,
  email: string,
  passwordHash: string,
) {
  return db.insert(userTable).values({ id: userId, email, password: passwordHash }).run();
}
