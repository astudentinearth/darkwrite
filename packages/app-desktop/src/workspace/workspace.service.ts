import {
  type CreateWorkspaceDTO,
  dwErrAsync,
  type UpdateWorkspaceDTO,
} from "@darkwrite/common";
import log from "electron-log";
import { okAsync, ResultAsync } from "neverthrow";
import type { DatabaseType } from "@/db";
import { resolveTx, transactional } from "@/db/transactional";
import { NoteDAO } from "@/note/note.dao";
import type { IDocumentService } from "@/service/document.service";
import { WorkspaceDAO } from "./workspace.dao";

export function WorkspaceService(
  db: DatabaseType,
  documentService: IDocumentService,
) {
  const noteDAO = NoteDAO(() => resolveTx(db));
  const workspaceDAO = WorkspaceDAO(() => resolveTx(db));

  const createWorkspace = ({
    allNotesSortMode,
    name,
    iconUrl,
  }: CreateWorkspaceDTO) =>
    workspaceDAO.create({
      name,
      iconUrl,
      createdAt: new Date(),
      allNotesSortMode,
    });

  /** Initializes a default workspace if no workspaces exist. Returns true if a workspace already exists, or the newly created workspace if not.
   * This method is idempotent, and calling it again is harmless. */
  const initializeDefaultWorkspace = () =>
    workspaceDAO
      .findAll()
      .map((w) => w.length)
      .andThen((count) =>
        count > 0
          ? okAsync(true)
          : createWorkspace({
              name: "My Workspace",
            }),
      );

  const findById = (id: string) => workspaceDAO.findById(id);

  const getWorkspaces = () => workspaceDAO.findAll();

  const update = (id: string, dto: UpdateWorkspaceDTO) =>
    workspaceDAO.update({ id, ...dto });

  const deleteWorkspace = (id: string) =>
    transactional(
      () =>
        workspaceDAO
          .findById(id)
          .andThen(() =>
            noteDAO
              .findAllByWorkspaceId(id)
              .map((notes) => notes.map((n) => n.id)),
          )
          .andThen((ids) => workspaceDAO.deleteById(id).map(() => ids)),
      db,
    ).andThen((ids) =>
      ResultAsync.combine(ids.map(documentService.deleteNoteContent))
        .orTee((err) =>
          log.error(
            "Failed to delete note contents from disk after workspace deletion. The notes have been removed from the database, but their contents may still exist on disk. Error: ",
            err,
          ),
        )
        .orElse(() => okAsync()),
    );

  /** @internal */
  const _insertNoteAt = (_ids: string[], noteId: string, atIndex?: number) => {
    const ids = [..._ids];
    if (atIndex === undefined) {
      if (!ids.includes(noteId)) ids.push(noteId);
    } else {
      const existingIndex = ids.indexOf(noteId);
      if (existingIndex !== -1) ids.splice(existingIndex, 1);
      const insertAt = Math.min(atIndex, ids.length);
      ids.splice(insertAt, 0, noteId);
    }
    return ids;
  };

  const addFavorite = (workspaceId: string, noteId: string, atIndex?: number) =>
    transactional(
      () =>
        ResultAsync.combine([
          workspaceDAO.findById(workspaceId),
          noteDAO.findById(noteId),
        ])
          .andThen(([workspace, note]) =>
            note.isTrashed
              ? dwErrAsync(
                  "Could not add favorite",
                  "Cannot favorite a trashed note.",
                )
              : okAsync(workspace.favoriteIds),
          )
          .map((ids) => _insertNoteAt(ids, noteId, atIndex))
          .andThen((ids) => workspaceDAO.setFavoriteIds(workspaceId, ids)),
      db,
    );

  const removeFavorite = (workspaceId: string, noteId: string) =>
    transactional(
      () =>
        workspaceDAO.findById(workspaceId).andThen((ws) =>
          workspaceDAO.setFavoriteIds(
            workspaceId,
            ws.favoriteIds.filter((id) => id !== noteId),
          ),
        ),
      db,
    );

  return {
    createWorkspace,
    initializeDefaultWorkspace,
    findById,
    deleteWorkspace,
    update,
    getWorkspaces,
    addFavorite,
    removeFavorite,
  };
}

export type IWorkspaceService = ReturnType<typeof WorkspaceService>;
