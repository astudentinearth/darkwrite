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

function validateMoveDto(dto: MoveNoteDTO): Result<void, DwError> {
  if (dto.placement !== "below") return ok();
  if (!dto.destinationId) return dwErr("Cannot move a note below nothing.");
  return ok();
}

export function NoteService(
  db: DatabaseType,
  documentService: IDocumentService,
) {
  const noteDAO = NoteDAO(() => resolveTx(db));

  const assertNotDescendant = (result: boolean | "CIRCULAR") =>
    result === "CIRCULAR" || result === true
      ? dwErrAsync(
          "Could not move note.",
          "This movement would create a circular reference.",
        )
      : ok();

  /** @internal */
  function canMoveBelow(source: NoteRow, dest: NoteRow) {
    if (source.isTrashed || dest.isTrashed)
      return dwErrAsync(
        "Could not move note.",
        "The target note is in trash. Take it out first.",
      );

    return noteDAO
      .isDescendant(dest.id, source.id)
      .andThen(assertNotDescendant);
  }

  /** @internal */
  function canMoveInto(source: NoteRow, dest: NoteRow | null) {
    if (!dest) return okAsync();
    if (source.isTrashed || dest.isTrashed)
      return dwErrAsync(
        "Could not move note.",
        "The target note is in trash. Take it out first.",
      );
    else
      return noteDAO
        .isDescendant(dest?.id, source.id)
        .andThen(assertNotDescendant);
  }

  /** @internal */
  function computeBelowRank(dest: NoteRow) {
    return noteDAO
      .noteRightAfter(dest.id, dest.workspaceId, "orderHint")
      .andThen((nextNote) => {
        if (nextNote) {
          try {
            const rank = new Rank(dest.orderHint).between(
              new Rank(nextNote.orderHint),
            );
            return ok(rank.get());
          } catch {
            return err({ type: "rank-collision" as const });
          }
        } else {
          return ok(new Rank(dest.orderHint).next().get());
        }
      })
      .orElse((error) => {
        if (!("type" in error) || error.type !== "rank-collision")
          return err(
            error as Exclude<typeof error, { type: "rank-collision" }>,
          );
        return noteDAO
          .findLastNoteInLayer(dest.workspaceId, dest.parentId)
          .map((note) =>
            note ? new Rank(note.orderHint).next().get() : Rank.default().get(),
          );
      });
  }

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

  const move = (dto: MoveNoteDTO) =>
    transactional(
      () =>
        validateMoveDto(dto)
          .asyncAndThen(() =>
            ResultAsync.combine([
              noteDAO.findById(dto.sourceId),
              dto.destinationId
                ? noteDAO.findById(dto.destinationId)
                : okAsync(null),
            ]),
          )
          .andThen(([source, destination]) =>
            dto.placement === "below"
              ? // biome-ignore lint/style/noNonNullAssertion: we validated dto shape previously
                moveBelow(source, destination!)
              : moveInto(source, destination, dto.placement),
          ),
      db,
    );

  const moveBelow = (source: NoteRow, destination: NoteRow) =>
    transactional(
      () =>
        canMoveBelow(source, destination)
          .andThen(() => computeBelowRank(destination))
          .andThen((orderHint) =>
            noteDAO.update({
              id: source.id,
              orderHint,
              parentId: destination.parentId,
            }),
          ),
      db,
    );

  const moveInto = (
    source: NoteRow,
    destination: NoteRow | null,
    placement: "inside-start" | "inside-end",
  ) =>
    transactional(
      () =>
        canMoveInto(source, destination)
          .andThen(() =>
            noteDAO.computeOrderKeysForLayer(
              source.workspaceId,
              destination?.id ?? null,
            ),
          )
          .andThen(({ start, end }) =>
            noteDAO.update({
              id: source.id,
              orderHint: placement === "inside-start" ? start : end,
              parentId: destination?.id ?? null,
            }),
          ),
      db,
    );

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
    move,
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
