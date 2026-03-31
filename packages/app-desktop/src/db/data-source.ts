import { DataSource } from "typeorm";
import { DB_PATH } from "../lib/paths";
import * as entities from "@/entity";
import * as relations from "./relations";
import * as tables from "./schema";

import { drizzle } from "drizzle-orm/libsql/node";
import { migrate } from "drizzle-orm/libsql/migrator";
import { is } from "@electron-toolkit/utils";

const dbPath = DB_PATH;

const getDatabaseUrl = () =>
  process.env["NODE_ENV"] === "test" ? ":memory:" : dbPath;

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: getDatabaseUrl(),
  entities,
  synchronize: true, // FIXME: ~~REMOVE BEFORE RELEASE~~ lol i'm removing typeorm
});

export function createDatabase(url: string = getDatabaseUrl()) {
  return drizzle({
    connection: {
      url,
    },
    schema: { ...tables, ...relations },
  });
}

export type DatabaseType = ReturnType<typeof createDatabase>;
export type Transaction = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];

export async function migrateDatabase(db: DatabaseType): Promise<DatabaseType> {
  await migrate(db, { migrationsFolder: is.dev ? "drizzle" : "../drizzle" });
  return db;
}

export const db: DatabaseType = createDatabase();
