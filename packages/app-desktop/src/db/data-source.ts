import { DataSource } from "typeorm";
import { DB_PATH } from "../lib/paths";
import * as entities from "@/entity";

import Database from "better-sqlite3";
import {drizzle} from "drizzle-orm/better-sqlite3";

const dbPath = DB_PATH;

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: process.env["NODE_ENV"] === "test" ? ":memory:" : dbPath,
  entities,
  synchronize: true, // FIXME: ~~REMOVE BEFORE RELEASE~~ lol i'm removing typeorm
});

export const drizzleDb = drizzle(new Database(dbPath));

