import { DataSource } from "typeorm";
import { DB_PATH } from "../lib/paths";
import * as entities from "@main/entity";

const dbPath = DB_PATH;

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: process.env["NODE_ENV"] === "test" ? ":memory:" : dbPath,
  entities,
  synchronize: true, // FIXME: REMOVE BEFORE RELEASE
});
