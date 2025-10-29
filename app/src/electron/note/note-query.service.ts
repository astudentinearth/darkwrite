import { NoteDAO } from "./note.dao";

export const NoteQueryService = {
  getAllByWorkspaceId: NoteDAO.findAllByWorkspaceId,
  getById: NoteDAO.findById,
};
