import type { Note, NotePartial } from "@darkwrite/common";
import { okAsync, ResultAsync } from "neverthrow";
import type { DatabaseType } from "@/db";
import { resolveTx, transactional } from "@/db/transactional";
import type { IDocumentService } from "@/service/document.service";
import { NoteDAO } from "./note.dao";
import { notePartialToRowPatch, noteToRow } from "./note-mapper";

export function NoteService(
  db: DatabaseType,
  documentService: IDocumentService,
) {
  const noteDAO = NoteDAO(() => resolveTx(db));
  function create(note: Note) {
    return transactional(
      () =>
        noteDAO
          .create(noteToRow(note))
          .andThen((created) =>
            documentService.setNoteContent(created.id, "{}"),
          )
          .map(() => undefined),
      db,
    );
  }
  const deleteById = (id: string) =>
    noteDAO.deleteById(id).andThen(() => documentService.deleteNoteContent(id));

  const setModificationDate = (id: string, date: Date) =>
    noteDAO.update({ id, modifiedAt: date });

  const emptyTrash = (workspaceId: string) =>
    transactional(
      () =>
        noteDAO
          .findAllTrashed(workspaceId)
          .map((notes) => notes.map((n) => n.id))
          .andThen((notes) => noteDAO.deleteMany(notes).map(() => notes)),
      db,
    ).andThen(
      (notes) =>
        ResultAsync.combine(
          notes.map((id) => documentService.deleteNoteContent(id)),
        ).orElse(() => okAsync()), // we don't care if files remain orphaned
    );

  const patchAll = (notes: NotePartial[]) =>
    transactional(
      () => noteDAO.updateAll(notes.map(notePartialToRowPatch)),
      db,
    );

  return {
    create,
    deleteById,
    setModificationDate,
    emptyTrash,
    patchAll,
  };
}

export type INoteService = ReturnType<typeof NoteService>;
