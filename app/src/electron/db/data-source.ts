import { DataSource } from "typeorm";
import { DB_PATH } from "../lib/paths";
import { NoteEntity } from "./entity/note";
import { TodoEntity, TodoListEntity } from "./entity/todo";
import { EmbedEntity } from "./entity/embed";

const dbPath = DB_PATH;

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  entities: [NoteEntity, TodoEntity, TodoListEntity, EmbedEntity],
  synchronize: true, // FIXME: REMOVE BEFORE RELEASE
});
