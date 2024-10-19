import bcrypt from "bcrypt";

import * as usersQueries from "@/database/drizzle/queries/users";

import { db } from "./db";

export const SALT_ROUNDS = 10;

export async function saltAndHashPassword(password: string) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

function addRandomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function verifyUser(email: string, password: string) {
  const user = await usersQueries.getUserByEmail(db, email);

  // prevent timing attack
  if (user.length === 0) {
    return false;
  }

  await addRandomDelay(50, 150);

  return await bcrypt.compare(password, user[0].password);
}
