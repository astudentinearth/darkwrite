import { NoteDAO } from "./note.dao";

const noteDAO = new NoteDAO();

export const NoteQueryService = {
  getAllByWorkspaceId: noteDAO.findAllByWorkspaceId.bind(noteDAO),
  getByParentId: noteDAO.findAllByParentId.bind(noteDAO),
  getById: noteDAO.findById.bind(noteDAO),
  getFavorites: noteDAO.findAllFavorites.bind(noteDAO),
  getTrashed: noteDAO.findAllTrashed.bind(noteDAO),
};
