import { DatabaseDAO } from "@/database/database.dao";
import { DatabaseType } from "@/db";
import { NewNote, Note } from "@/db/schema";
import { resolveTx, transactional } from "@/db/transactional";
import { IDocumentService } from "@/service/document.service";
import { WorkspaceDAO } from "@/workspace/workspace.dao";
import {
  CreateNoteDTO,
  MoveNoteDTO,
  NoteError,
  Rank,
  UpdateNoteDTO,
} from "@darkwrite/common";
import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { NoteDAO, OrderKeyDto } from "./note.dao";

function buildNewNote(dto: CreateNoteDTO, { end }: OrderKeyDto): NewNote {
  const { title, workspaceId, databaseId, icon, parentId } = dto;
  return {
    title,
    workspaceId,
    databaseId,
    icon,
    parentId,
    favoriteOrderHint: "",
    createdAt: new Date(),
    modifiedAt: new Date(),
    orderHint: end,
  };
}

function buildDuplicate({
  title,
  icon,
  databaseId,
  workspaceId,
  propertyValues,
  parentId,
}: Note): NewNote {
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

function validateMoveDto(dto: MoveNoteDTO): Result<void, NoteError> {
  if (dto.placement !== "below") return ok();
  if (!dto.destinationId)
    return err({
      type: "note-failed-to-move",
      cause: "cannot-move-below-null",
    } satisfies NoteError);
  return ok();
}

type RankCollisionErr = { type: "rank-collision" };

export function NoteService(
  db: DatabaseType,
  documentService: IDocumentService,
) {
  const noteDAO = NoteDAO(() => resolveTx(db));
  const workspaceDAO = WorkspaceDAO(() => resolveTx(db));
  const databaseDAO = DatabaseDAO(() => resolveTx(db));

  const assertNotDescendant = (result: boolean | "CIRCULAR") =>
    result === "CIRCULAR" || result === true
      ? err<void, NoteError>({
          type: "note-failed-to-move",
          cause: "circular-reference",
        })
      : ok();

  /** @internal */
  function canMoveBelow(source: Note, dest: Note) {
    if (source.isTrashed || dest.isTrashed)
      return errAsync<void, NoteError>({
        type: "note-failed-to-move",
        cause: "trashed",
      });

    return noteDAO
      .isDescendant(dest.id, source.id)
      .andThen(assertNotDescendant);
  }

  /** @internal */
  function canMoveInto(source: Note, dest: Note | null) {
    if (!dest) return okAsync();
    if (source.isTrashed || dest.isTrashed)
      return errAsync<void, NoteError>({
        type: "note-failed-to-move",
        cause: "trashed",
      });
    else
      return noteDAO
        .isDescendant(dest?.id, source.id)
        .andThen(assertNotDescendant);
  }

  /** @internal */
  function computeBelowRank(dest: Note) {
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
            return err({ type: "rank-collision" } satisfies RankCollisionErr);
          }
        } else {
          return ok(new Rank(dest.orderHint).next().get());
        }
      })
      .orElse((error) => {
        if (error.type !== "rank-collision") return err(error);
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

  function create(dto: CreateNoteDTO) {
    return transactional(
      () =>
        workspaceDAO
          .findById(dto.workspaceId)
          .andThen((w) => noteDAO.computeOrderKeysForLayer(w.id, dto.parentId))
          .map((keys) => buildNewNote(dto, keys))
          .andThen(noteDAO.create)
          .andThen((note) =>
            documentService.setNoteContent(note.id, "{}").map(() => note),
          ),
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
              ? moveBelow(source, destination!) // we validated dto shape previously
              : moveInto(source, destination, dto.placement),
          ),
      db,
    );

  const moveBelow = (source: Note, destination: Note) =>
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
    source: Note,
    destination: Note | null,
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
      () =>
        (dto.databaseId
          ? databaseDAO.findById(dto.databaseId).andThen(() => okAsync())
          : okAsync()
        ).andThen(() => noteDAO.update({ id, modifiedAt: new Date(), ...dto })),
      db,
    );

  const favorite = (targetId: string, aboveNoteId?: string | null) =>
    transactional(
      () =>
        noteDAO
          .findById(targetId)
          .andThen((note) =>
            note.isTrashed
              ? err({ type: "cannot-favorite-in-trash" } satisfies NoteError)
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
              ({ ...duplicate, orderHint: keys.end }) satisfies NewNote,
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
  };
}

export type INoteService = ReturnType<typeof NoteService>;
