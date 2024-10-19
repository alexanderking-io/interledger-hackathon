import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email", { length: 255 }).notNull(),
  password: text("password", { length: 60 }).notNull().default(""),
});

export type UserItem = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
