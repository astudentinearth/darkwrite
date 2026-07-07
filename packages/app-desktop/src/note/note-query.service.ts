import type { DatabaseType } from "@/db";
import { resolveTx } from "@/db/transactional";
import { DatabaseViewDAO } from "./database-view.dao";
import { NoteDAO } from "./note.dao";

export function NoteQueryService(db: DatabaseType) {
  const noteDAO = NoteDAO(() => resolveTx(db));
  const databaseViewDAO = DatabaseViewDAO(() => resolveTx(db));

  const getDatabaseView = (id: string) =>
    noteDAO
      .findById(id)
      .andThen((note) =>
        databaseViewDAO.getView(note.id).map((view) => ({ note, view })),
      );

  return {
    getAllByWorkspaceId: noteDAO.findAllByWorkspaceId,
    getByParentId: noteDAO.findAllByParentId,
    getById: noteDAO.findById,
    getFavorites: noteDAO.findAllFavorites,
    getTrashed: noteDAO.findAllTrashed,
    search: noteDAO.searchByTitle,
    getRecents(workspaceId: string) {
      const recents = noteDAO.getRecentlyModifiedNotes(workspaceId, 5);
      return recents;
    },
    getParentTree: noteDAO.resolveParentTree,
    getDatabaseView,
  };
}

export type INoteQueryService = ReturnType<typeof NoteQueryService>;
