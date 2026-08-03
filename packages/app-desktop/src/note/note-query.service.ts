import type { DatabaseType } from "@/db";
import { resolveTx } from "@/db/transactional";
import { NoteDAO } from "./note.dao";

export function NoteQueryService(db: DatabaseType) {
  const noteDAO = NoteDAO(() => resolveTx(db));
  return {
    getAllByWorkspaceId: noteDAO.findAllByWorkspaceId,
  };
}

export type INoteQueryService = ReturnType<typeof NoteQueryService>;
