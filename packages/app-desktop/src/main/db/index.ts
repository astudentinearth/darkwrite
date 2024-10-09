import { DataSource } from "typeorm";
import { NoteEntity } from "./entity/note";
import { join } from "path";
import { app } from "electron";
import { TodoEntity, TodoListEntity } from "./entity/todo";

const dbPath = join(app.getPath("userData"), "data.db");

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  entities: [NoteEntity, TodoEntity, TodoListEntity],
  synchronize: true, // FIXME: REMOVE BEFORE RELEASE
});
