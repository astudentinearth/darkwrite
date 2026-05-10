import { DatabaseType } from "@/db";
import { FileLinkDAO } from "./file-link.dao";
import { resolveTx } from "@/db/transactional";

export function FileLinkService(db: DatabaseType) {
  const fileLinkDao = FileLinkDAO(() => resolveTx(db));

  const createFileLink = (filePath: string) => fileLinkDao.create({ filePath });
  const getFileLinkById = (id: string) => fileLinkDao.findById(id);

  return { createFileLink, getFileLinkById };
}
