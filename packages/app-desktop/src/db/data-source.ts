import { DataSource } from "typeorm";
import { DB_PATH } from "../lib/paths";
import * as entities from "@/entity";
import * as relations from "./relations";
import * as tables from "./schema";

//import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/libsql/node";
import { migrate } from "drizzle-orm/libsql/migrator";

const dbPath = DB_PATH;

const getDatabaseUrl = () =>
  process.env["NODE_ENV"] === "test" ? ":memory:" : dbPath;

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: getDatabaseUrl(),
  entities,
  synchronize: true, // FIXME: ~~REMOVE BEFORE RELEASE~~ lol i'm removing typeorm
});

export const db = drizzle({
  connection: {
    url: getDatabaseUrl(),
  },
  schema: { ...tables, ...relations },
});

export type DatabaseType = typeof db;
export type Transaction = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];
