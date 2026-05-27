import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { drizzle } from "drizzle-orm/libsql/node";
import { DB_PATH } from "../lib/paths";
import * as relations from "./relations";
import * as tables from "./schema";

const dbPath = DB_PATH;
export const DB_SYMBOL = Symbol("darkwrite-db-instance");

const getDatabaseUrl = () =>
  process.env.NODE_ENV === "test" ? ":memory:" : pathToFileURL(dbPath).href;

function makeDrizzleDb(url: string) {
  return drizzle({
    connection: {
      url,
    },
    schema: { ...tables, ...relations },
  });
}

export function createDatabase(url: string = getDatabaseUrl()): DatabaseType {
  const _db = makeDrizzleDb(url);
  (_db as DatabaseType)[DB_SYMBOL] = true;
  return _db as DatabaseType;
}

export function isDataSource(x: DatabaseType | Transaction): x is DatabaseType {
  return (x as DatabaseType)[DB_SYMBOL] === true;
}

export function createTestDatabase() {
  //FIXME: workaround for libsql :memory: bug where transactions don't commit properly.
  // See https://github.com/tursodatabase/libsql-client-ts/issues/229
  const path = join(tmpdir(), `.dwtest-${randomUUID()}.db`);
  return createDatabase(`file:///${path}`);
}

export type DatabaseType = ReturnType<typeof makeDrizzleDb> & {
  [DB_SYMBOL]: true;
};

export type Transaction = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];

export let db: DatabaseType;

export function initDatabase() {
  db = createDatabase();
  return db;
}
