import { showOpenDialog, whenDialogCancelled } from "@/api/dialog";
import { handler, type HandlerImplements } from "@/types";
import {
  buildDwError,
  type FileLinkMetadata,
  type IFileLinkAPI,
} from "@darkwrite/common";
import { shell } from "electron";
import { ok } from "neverthrow";
import { previewFileLink } from "./file-link-preview";
import type { IFileLinkService } from "./file-link.service";

/** @internal */
function resolveMetadata(id: string, filePath: string) {
  return previewFileLink(filePath)
    .map((p) => ({ ...p, id }) satisfies FileLinkMetadata)
    .mapErr(() => buildDwError("File link not found."));
}

export function FileLinkAPI(
  fileLinkService: IFileLinkService,
): HandlerImplements<IFileLinkAPI> {
  const pickAndCreate = handler(() =>
    showOpenDialog({ properties: ["openFile"] })
      .andThen(([filepath]) => fileLinkService.createFileLink(filepath))
      .andThen((link) => resolveMetadata(link.id, link.filePath))
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
      .andThen((link) => resolveMetadata(link.id, link.filePath)),
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

  return {
    getById,
    createFromPath,
    openById,
    pickAndCreate,
  };
}
