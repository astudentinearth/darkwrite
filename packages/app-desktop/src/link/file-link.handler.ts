import { IPCHandler } from "@/types";
import { FileLinkMetadata, NotFoundError } from "@darkwrite/common";
import { dialog, shell } from "electron";
import { db } from "@/db";
import { FileLinkService } from "./file-link.service";
import { FileLinkPreviewer } from "./file-link-preview";

let service: FileLinkService;
let previewer: FileLinkPreviewer;

export function initializeFileLinkAPI() {
  service = new FileLinkService(db);
  previewer = new FileLinkPreviewer();
}

async function resolveMetadata(
  id: string,
  filePath: string,
): Promise<FileLinkMetadata> {
  const preview = await previewer.previewFileLink(filePath);
  return { id, ...preview };
}

export const ElectronFileLinkAPI = {
  async pickAndCreate(): Promise<FileLinkMetadata | null> {
    const result = await dialog.showOpenDialog({ properties: ["openFile"] });
    if (result.canceled || result.filePaths.length === 0) return null;
    const [filePath] = result.filePaths;
    const link = await service.createFileLink(filePath);
    return resolveMetadata(link.id, link.filePath);
  },

  async getById(id: string): Promise<FileLinkMetadata> {
    const link = await service.getFileLinkById(id);
    if (!link) throw new NotFoundError("FileLink", id);
    return resolveMetadata(link.id, link.filePath);
  },

  async createFromPath(filePath: string): Promise<FileLinkMetadata> {
    const link = await service.createFileLink(filePath);
    return resolveMetadata(link.id, link.filePath);
  },

  async openById(id: string): Promise<void> {
    const link = await service.getFileLinkById(id);
    if (!link) throw new NotFoundError("FileLink", id);
    await shell.openPath(link.filePath);
  },
};

export const FileLinkApiBridge = {
  pickAndCreate: new IPCHandler(false, ElectronFileLinkAPI.pickAndCreate),
  createFromPath: new IPCHandler(false, ElectronFileLinkAPI.createFromPath),
  getById: new IPCHandler(false, ElectronFileLinkAPI.getById),
  openById: new IPCHandler(false, ElectronFileLinkAPI.openById),
};
