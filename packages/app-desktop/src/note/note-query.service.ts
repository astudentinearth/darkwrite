import type { DatabaseType } from "@/db";
import { resolveTx } from "@/db/transactional";
import { NoteDAO } from "./note.dao";

export function NoteQueryService(db: DatabaseType) {
  const noteDAO = NoteDAO(() => resolveTx(db));
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
  };
}

export type INoteQueryService = ReturnType<typeof NoteQueryService>;
