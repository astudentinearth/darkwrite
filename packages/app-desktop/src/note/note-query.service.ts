import { resolveTx } from "@/db/transactional";
import { NoteDAO } from "./note.dao";
import { db } from "@/db";

const noteDAO = NoteDAO(() => resolveTx(db));

export const NoteQueryService = {
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
