import { NoteDAOInstance } from "./note.dao";

export function NoteQueryService(noteDAO: NoteDAOInstance) {
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
