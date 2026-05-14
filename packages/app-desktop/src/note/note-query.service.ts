import { NoteDAO } from "./note.dao";

export function getNoteQueryService() {
  const noteDAO = new NoteDAO();

  return {
    getAllByWorkspaceId: noteDAO.findAllByWorkspaceId.bind(noteDAO),
    getByParentId: noteDAO.findAllByParentId.bind(noteDAO),
    getById: noteDAO.findById.bind(noteDAO),
    getFavorites: noteDAO.findAllFavorites.bind(noteDAO),
    getTrashed: noteDAO.findAllTrashed.bind(noteDAO),
    search: noteDAO.searchByTitle.bind(noteDAO),
    getRecents(workspaceId: string) {
      const recents = noteDAO.getRecentlyModifiedNotes(workspaceId, 5);
      return recents;
    },
    getParentTree: noteDAO.resolveParentTree.bind(noteDAO),
  };
}
