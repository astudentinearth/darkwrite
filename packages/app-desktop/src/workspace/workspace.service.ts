import {
  type CreateWorkspaceDTO,
  getDefaultWorkspaceConfiguration,
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

  const createWorkspace = ({ config, name, iconUrl }: CreateWorkspaceDTO) =>
    workspaceDAO.create({
      config,
      name,
      iconUrl,
      createdAt: new Date(),
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
              config: getDefaultWorkspaceConfiguration(),
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

  return {
    createWorkspace,
    initializeDefaultWorkspace,
    findById,
    deleteWorkspace,
    update,
    getWorkspaces,
  };
}

export type IWorkspaceService = ReturnType<typeof WorkspaceService>;
