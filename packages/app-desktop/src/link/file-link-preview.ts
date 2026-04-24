import { FileLinkMetadata } from "@darkwrite/common";
import { FileNotFoundError } from "@/lib/fs";
import fse from "fs-extra";
import mime from "mime";

export interface IFileLinkPreviewer {
  previewFileLink(filePath: string): Promise<Omit<FileLinkMetadata, "id">>;
}

export class FileLinkPreviewer implements IFileLinkPreviewer {
  /**
   * Returns metadata for the file at the given path.
   * Uses the file extension to determine the MIME type.
   * @throws {FileNotFoundError} if the file does not exist on disk.
   */
  async previewFileLink(
    filePath: string,
  ): Promise<Omit<FileLinkMetadata, "id">> {
    if (!(await fse.pathExists(filePath))) {
      throw new FileNotFoundError(filePath);
    }
    const mimeType = mime.getType(filePath) ?? undefined;
    return { filePath, mimeType };
  }
}
