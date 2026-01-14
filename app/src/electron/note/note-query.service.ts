import { NoteDAO } from "./note.dao";

export const NoteQueryService = {
  getAllByWorkspaceId: NoteDAO.findAllByWorkspaceId,
  getByParentId: NoteDAO.findAllByParentId,
  getById: NoteDAO.findById,
};
