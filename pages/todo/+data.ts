// https://vike.dev/data
import * as drizzleQueries from "../../database/drizzle/queries/todos";
import type { PageContextServer } from "vike/types";

export type Data = {
  todo: { text: string }[];
};

export default async function data(_pageContext: PageContextServer): Promise<Data> {
  const todo = await drizzleQueries.getAllTodos(_pageContext.db);

  return { todo };
}
