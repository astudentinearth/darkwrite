import {
  type DwError,
  dwErr,
  dwErrAsync,
  type MoveNoteDTO,
  type Note,
  type NotePartial,
  Rank,
  type UpdateNoteDTO,
} from "@darkwrite/common";
import { err, ok, okAsync, type Result, ResultAsync } from "neverthrow";
import type { DatabaseType } from "@/db";
import type { NewNoteRow, NoteRow } from "@/db/schema";
import { resolveTx, transactional } from "@/db/transactional";
import type { IDocumentService } from "@/service/document.service";
import { NoteDAO } from "./note.dao";
import { notePartialToRowPatch, noteToRow } from "./note-mapper";

function buildDuplicate({
  title,
  icon,
  databaseId,
  workspaceId,
  propertyValues,
  parentId,
}: NoteRow): NewNoteRow {
  return {
    title: `${title} (copy)`,
    icon,
    databaseId,
    workspaceId,
    propertyValues,
    parentId,
    orderHint: "",
    favoriteOrderHint: "",
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
}

export function NoteService(
  db: DatabaseType,
  documentService: IDocumentService,
) {
  const noteDAO = NoteDAO(() => resolveTx(db));

  /** @internal */
  function computeFavoriteRank(workspaceId: string, aboveId?: string | null) {
    return aboveId == null
      ? noteDAO
          .computeOrderKeysForFavorites(workspaceId)
          .map((keys) => (aboveId === undefined ? keys.end : keys.start))
      : ResultAsync.combine([
          noteDAO.findById(aboveId),
          noteDAO.noteRightAfter(aboveId, workspaceId, "favoriteOrderHint"),
        ]).map(([above, below]) =>
          below
            ? new Rank(above.favoriteOrderHint)
                .between(below.favoriteOrderHint)
                .get()
            : new Rank(above.favoriteOrderHint).next().get(),
        );
  }

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

  const update = (id: string, dto: UpdateNoteDTO) =>
    transactional(
      () => noteDAO.update({ id, modifiedAt: new Date(), ...dto }),
      db,
    );

  const favorite = (targetId: string, aboveNoteId?: string | null) =>
    transactional(
      () =>
        noteDAO
          .findById(targetId)
          .andThen((note) =>
            note.isTrashed
              ? dwErr("Cannot favorite a note in trash.")
              : ok(note),
          )
          .andThen((note) => computeFavoriteRank(note.workspaceId, aboveNoteId))
          .andThen((rank) =>
            noteDAO.update({
              id: targetId,
              isFavorite: true,
              favoriteOrderHint: rank,
            }),
          ),
      db,
    );

  const unfavorite = (id: string) =>
    noteDAO.update({ id, isFavorite: false, favoriteOrderHint: "" });

  const duplicate = (id: string) =>
    transactional(
      () =>
        noteDAO
          .findById(id)
          .andThen((note) =>
            ResultAsync.combine([
              okAsync(buildDuplicate(note)),
              noteDAO.computeOrderKeysForLayer(note.workspaceId, note.parentId),
            ]),
          )
          .map(
            ([duplicate, keys]) =>
              ({ ...duplicate, orderHint: keys.end }) satisfies NewNoteRow,
          )
          .andThen(noteDAO.create)
          .andThen((n) =>
            ResultAsync.combine([
              okAsync(n),
              documentService.getNoteContent(id),
            ]),
          )
          .andThen(([note, content]) =>
            documentService
              .setNoteContent(note.id, JSON.stringify(content))
              .map(() => note),
          ),
      db,
    );

  const deleteById = (id: string) =>
    noteDAO.deleteById(id).andThen(() => documentService.deleteNoteContent(id));

  const moveToTrash = (id: string) =>
    noteDAO.update({
      id,
      isTrashed: true,
      orderHint: "",
      favoriteOrderHint: "",
      isFavorite: false,
    });

  const setModificationDate = (id: string, date: Date) =>
    noteDAO.update({ id, modifiedAt: date });

  const restoreFromTrash = (id: string) =>
    transactional(
      () =>
        noteDAO
          .findById(id)
          .andThen((note) =>
            noteDAO
              .computeOrderKeysForLayer(note.workspaceId, note.parentId)
              .map((keys) => keys.end),
          )
          .andThen((orderHint) =>
            noteDAO.update({ id, isTrashed: false, orderHint }),
          ),
      db,
    );

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
    update,
    favorite,
    unfavorite,
    duplicate,
    deleteById,
    moveToTrash,
    setModificationDate,
    restoreFromTrash,
    emptyTrash,
    patchAll,
  };
}

export type INoteService = ReturnType<typeof NoteService>;
