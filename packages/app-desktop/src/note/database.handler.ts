import {
  type CreateDatabaseArgs,
  type CreateDatabaseViewArgs,
  type IDatabaseAPI,
  validateSchema,
  ZCreateDatabaseRequest,
  ZCreateDatabaseViewRequest,
} from "@darkwrite/common";
import { type HandlerImplements, handler } from "@/types";
import type { INoteService } from "./note.service";
import { noteToDto } from "./note-mapper";
import type { INoteQueryService } from "./note-query.service";

export type DatabaseAPIDeps = {
  noteService: INoteService;
  noteQueryService: INoteQueryService;
};

export function DatabaseAPI({
  noteService,
  noteQueryService,
}: DatabaseAPIDeps): HandlerImplements<IDatabaseAPI> {
  const createDatabase = handler((dto: CreateDatabaseArgs) =>
    validateSchema(ZCreateDatabaseRequest)(dto)
      .asyncAndThen(noteService.createDatabase)
      .map((result) => ({
        database: noteToDto(result.database),
        views: [noteToDto(result.view)],
        viewMetadata: [result.viewMeta],
      })),
  );

  const createDatabaseView = handler((dto: CreateDatabaseViewArgs) =>
    validateSchema(ZCreateDatabaseViewRequest)(dto).asyncAndThen((result) =>
      noteService
        .createDatabaseView(result.databaseId, result.type)
        .map((result) => ({
          note: noteToDto(result.note),
          meta: result.view,
        })),
    ),
  );

  const getDatabaseView = handler((id: string) =>
    noteQueryService
      .getDatabaseView(id)
      .map((result) => ({ note: noteToDto(result.note), meta: result.view })),
  );

  const getViewsOf = handler((databaseId: string) =>
    noteQueryService.getAllViewsOf(databaseId).map((result) => ({
      notes: result.map((i) => noteToDto(i.note)),
      views: result.map((i) => i.database_view),
    })),
  );

  const getNotesInDatabase = handler((databaseId: string) =>
    noteQueryService
      .getAllDocumentsInDatabase(databaseId)
      .map((notes) => ({ notes: notes.map(noteToDto) })),
  );

  return {
    createDatabase,
    createDatabaseView,
    getDatabaseView,
    getViewsOf,
    getNotesInDatabase,
  };
}
