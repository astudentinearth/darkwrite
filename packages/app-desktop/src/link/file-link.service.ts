import { DatabaseType } from "@/db";
import { FileLinkDAO } from "./file-link.dao";

export class FileLinkService {
  private fileLinkDao: FileLinkDAO;
  constructor(
    private db: DatabaseType,
    fileLinkDao?: FileLinkDAO,
  ) {
    this.fileLinkDao = fileLinkDao ?? new FileLinkDAO(db);
  }

  async createFileLink(filePath: string) {
    return await this.fileLinkDao.create({ filePath });
  }

  async getFileLinkById(id: string) {
    return await this.fileLinkDao.findById(id);
  }
}
