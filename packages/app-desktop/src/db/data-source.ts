import { DB_PATH } from "../lib/paths";
import * as relations from "./relations";
import * as tables from "./schema";

import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/libsql/node";
import { tmpdir } from "os";
import { join } from "path";

const dbPath = DB_PATH;

const getDatabaseUrl = () =>
  process.env["NODE_ENV"] === "test" ? ":memory:" : `file://${dbPath}`;

export function createDatabase(url: string = getDatabaseUrl()) {
  return drizzle({
    connection: {
      url,
    },
    schema: { ...tables, ...relations },
  });
}

export function createTestDatabase() {
  //FIXME: workaround for libsql :memory: bug where transactions don't commit properly.
  // See https://github.com/tursodatabase/libsql-client-ts/issues/229
  const path = join(tmpdir(), `.dwtest-${randomUUID()}.db`);
  return createDatabase(`file:///${path}`);
}

export type DatabaseType = ReturnType<typeof createDatabase>;
export type Transaction = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];

export let db: DatabaseType;

export function initDatabase() {
  db = createDatabase();
}

