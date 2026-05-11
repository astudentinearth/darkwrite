import { showOpenDialog, whenDialogCancelled } from "@/api/dialog";
import { DbError } from "@/db/transactional";
import { handler, HandlerImplements } from "@/types";
import {
  FileLinkError,
  FileLinkMetadata,
  IFileLinkAPI,
  InternalError,
} from "@darkwrite/common";
import { shell } from "electron";
import { ok } from "neverthrow";
import { previewFileLink } from "./file-link-preview";
import { IFileLinkService } from "./file-link.service";

/** @internal */
function resolveMetadata(id: string, filePath: string) {
  return previewFileLink(filePath)
    .map((p) => ({ ...p, id }) satisfies FileLinkMetadata)
    .mapErr((err) =>
      err.type === "file-not-found"
        ? ({ type: "file-link-target-missing", id } satisfies FileLinkError)
        : (err as never),
    );
}

/** @internal */
function mapErrors(
  error: DbError | FileLinkError | InternalError,
): FileLinkError | InternalError {
  switch (error.type) {
    case "db-error":
      return { type: "internal-error", message: "Database error" };

    default:
      return error;
  }
}

export function FileLinkAPI(
  fileLinkService: IFileLinkService,
): HandlerImplements<IFileLinkAPI> {
  const pickAndCreate = handler(() =>
    showOpenDialog({ properties: ["openFile"] })
      .andThen(([filepath]) => fileLinkService.createFileLink(filepath))
      .andThen((link) => resolveMetadata(link.id, link.filePath))
      .orElse(whenDialogCancelled(null))
      .mapErr(mapErrors),
  );

  const getById = handler((id: string) =>
    fileLinkService
      .getFileLinkById(id)
      .andThen(({ filePath }) => resolveMetadata(id, filePath))
      .mapErr(mapErrors),
  );

  const createFromPath = handler((filePath: string) =>
    fileLinkService
      .createFileLink(filePath)
      .andThen((link) => resolveMetadata(link.id, link.filePath))
      .mapErr(mapErrors),
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
