import {
  type CreateDatabaseRequest,
  type CreateDocumentRequest,
  DatabaseViewType,
  dwErr,
  dwErrAsync,
  type MoveNoteDTO,
  NoteType,
  Rank,
  type UpdateNoteDTO,
} from "@darkwrite/common";
import { ok, okAsync, ResultAsync } from "neverthrow";
import type { DatabaseType } from "@/db";
import type { NewNote, Note } from "@/db/schema";
import { resolveTx, transactional } from "@/db/transactional";
import type { IDocumentService } from "@/service/document.service";
import { DatabaseViewDAO } from "./database-view.dao";
import { NoteDAO } from "./note.dao";

function buildNewNote(dto: CreateDocumentRequest): NewNote {
  const { title, workspaceId, icon, parentId } = dto;
  return {
    title,
    workspaceId,
    icon,
    parentId,
    favoriteOrderHint: "",
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
}

function buildDuplicate({ title, icon, workspaceId, parentId }: Note): NewNote {
  return {
    title: `${title} (copy)`,
    icon,
    workspaceId,
    parentId,
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
  const databaseViewDAO = DatabaseViewDAO(() => resolveTx(db));

  const isTrashOrCircular = (source: Note, parent?: Note | null) => {
    if (source.isTrashed)
      return dwErrAsync("Could not move note.", "The source note is in trash.");
    if (parent?.isTrashed)
      return dwErrAsync(
        "Could not move note.",
        "The target note is in trash. Take it out first.",
      );
    if (!parent) return okAsync<undefined>(undefined);
    return noteDAO
      .isDescendant(parent.id, source.id)
      .andThen((result) =>
        result === "CIRCULAR" || result === true
          ? dwErrAsync(
              "Could not move note.",
              "This movement would create a circular reference.",
            )
          : okAsync(undefined),
      );
  };

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

  function createDatabaseView(
    databaseId: string,
    type: DatabaseViewType = DatabaseViewType.Table,
    title?: string,
  ) {
    return transactional(
      () =>
        noteDAO
          .findById(databaseId)
          .andThen((database) =>
            noteDAO.create({
              type: NoteType.DatabaseView,
              favoriteOrderHint: "",
              createdAt: new Date(),
              modifiedAt: new Date(),
              title: title ?? `View of ${database.title}`,
              workspaceId: database.workspaceId,
              parentId: database.id,
            }),
          )
          .andThen(setDefaultDocument)
          .andThen((note) =>
            databaseViewDAO
              .createView({ id: note.id, type })
              .map((view) => ({ note, view })),
          ),
      db,
    );
  }

  function setDefaultDocument(note: Note) {
    return documentService.setNoteContent(note.id, "{}").map(() => note);
  }

  function createDocument(dto: CreateDocumentRequest) {
    return transactional(
      () => noteDAO.create(buildNewNote(dto)).andThen(setDefaultDocument),
      db,
    );
  }

  /** Creates a new database and initializes a default database view for it.
   * @returns the database, initialized view and view metadata */
  function createDatabase(dto: CreateDatabaseRequest) {
    return transactional(
      () =>
        noteDAO
          .create({
            workspaceId: dto.workspaceId,
            parentId: dto.parentId,
            favoriteOrderHint: "",
            createdAt: new Date(),
            modifiedAt: new Date(),
            title: "New database",
            type: NoteType.Database,
          })
          .andThen(setDefaultDocument)
          .andThen((database) =>
            createDatabaseView(database.id).map((result) => ({
              view: result.note,
              viewMeta: result.view,
              database,
            })),
          ),
      db,
    );
  }

  const move = (dto: MoveNoteDTO) =>
    transactional(
      () =>
        noteDAO
          .findById(dto.sourceId)
          .andThen((source) =>
            dto.parentId
              ? noteDAO
                  .findById(dto.parentId)
                  .map((parent) => ({ source, parent }))
              : okAsync({ source, parent: null as Note | null }),
          )
          .andThen(({ source, parent }) =>
            isTrashOrCircular(source, parent).map(() => ({ source, parent })),
          )
          .andThen(({ source, parent }) =>
            noteDAO.update({
              id: source.id,
              parentId: parent?.id ?? null,
              workspaceId: parent?.workspaceId ?? source.workspaceId,
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
          .andThen((note) => okAsync(buildDuplicate(note)))
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
      favoriteOrderHint: "",
      isFavorite: false,
    });

  const setModificationDate = (id: string, date: Date) =>
    noteDAO.update({ id, modifiedAt: date });

  const restoreFromTrash = (id: string) =>
    transactional(
      () =>
        noteDAO.findById(id).andThen(() =>
          noteDAO.update({
            id,
            isTrashed: false,
          }),
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
    create: createDocument,
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
    createDatabase,
    createDatabaseView,
  };
}

export type INoteService = ReturnType<typeof NoteService>;
