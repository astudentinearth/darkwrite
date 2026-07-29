import {
  buildDwError,
  type FileLinkMetadata,
  type IFileLinkAPI,
} from "@darkwrite/common";
import { BrowserWindow, type IpcMainInvokeEvent, shell } from "electron";
import { ok } from "neverthrow";
import { showOpenDialog, whenDialogCancelled } from "@/api/dialog";
import { type HandlerImplements, handler } from "@/types";
import { WindowEvent } from "@/types/window-events";
import type { IFileLinkService } from "./file-link.service";
import { previewFileLink } from "./file-link-preview";

/** @internal */
function resolveMetadata(id: string, filePath: string) {
  return previewFileLink(filePath)
    .map((p) => ({ ...p, id }) satisfies FileLinkMetadata)
    .mapErr(() => buildDwError("File link not found."));
}

/** Notifies every renderer of a newly created file link so each window can
 * keep its in-memory file link list in sync. The originating window is
 * included, since callers (e.g. the editor drop handler) do not update the
 * store themselves. */
function broadcastFileLinkCreated(link: FileLinkMetadata) {
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send(WindowEvent.FILE_LINK_CREATED, link);
  }
}

export function FileLinkAPI(
  fileLinkService: IFileLinkService,
): HandlerImplements<IFileLinkAPI> {
  const pickAndCreate = handler(() =>
    showOpenDialog({ properties: ["openFile"] })
      .andThen(([filepath]) => fileLinkService.createFileLink(filepath))
      .andThen((link) => resolveMetadata(link.id, link.filePath))
      .andTee(broadcastFileLinkCreated)
      .orElse(whenDialogCancelled(null)),
  );

  const getById = handler((id: string) =>
    fileLinkService
      .getFileLinkById(id)
      .andThen(({ filePath }) => resolveMetadata(id, filePath)),
  );

  const createFromPath = handler((filePath: string) =>
    fileLinkService
      .createFileLink(filePath)
      .andThen((link) => resolveMetadata(link.id, link.filePath))
      .andTee(broadcastFileLinkCreated),
  );

  const openById = handler((id: string) =>
    fileLinkService
      .getFileLinkById(id)
      .andThen((link) => {
        shell.openPath(link.filePath);
        return ok();
      })
      .orElse(() => ok()),
  );

  const getAll = handler(() => fileLinkService.getAll());

  return {
    getById,
    createFromPath,
    openById,
    pickAndCreate,
    getAll,
  };
}
