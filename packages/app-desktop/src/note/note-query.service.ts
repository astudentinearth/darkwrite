import type { DatabaseType } from "@/db";
import { resolveTx } from "@/db/transactional";
import { NoteDAO } from "./note.dao";

export function NoteQueryService(db: DatabaseType) {
  const noteDAO = NoteDAO(() => resolveTx(db));
  return {
    getAllByWorkspaceId: noteDAO.findAllByWorkspaceId,
    getById: noteDAO.findById,
    search: noteDAO.searchByTitle,
  };
}

export type INoteQueryService = ReturnType<typeof NoteQueryService>;
