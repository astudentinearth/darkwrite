import type { DatabaseType } from "@/db";
import { resolveTx } from "@/db/transactional";
import { FileLinkDAO } from "./file-link.dao";

export function FileLinkService(db: DatabaseType) {
  const fileLinkDao = FileLinkDAO(() => resolveTx(db));

  const createFileLink = (filePath: string) => fileLinkDao.create({ filePath });
  const getFileLinkById = (id: string) => fileLinkDao.findById(id);
  const getAll = fileLinkDao.findAll;

  return { createFileLink, getFileLinkById, getAll };
}

export type IFileLinkService = ReturnType<typeof FileLinkService>;
