import { INoteAPI } from "@/common/contract";
import { NoteDTO } from "@/common/dto";
import { FileFormatMap, NoteExportFormat } from "@/common/note";
import { dialog } from "electron";
import { BrowserWindow } from "electron";
import { writeFile } from "fs-extra";
import { ServiceContainer } from "../service-container";

export const ElectronNoteAPI: INoteAPI = {
  async create(dto) {
    const note = await ServiceContainer.noteService.create(dto);
    return { note: note.mapToDTO() };
  },

  async delete(id) {
    ServiceContainer.noteService.deleteById(id);
  },

  async getAllByWorkspaceId(workspaceId) {
    const notes =
      await ServiceContainer.noteService.getAllByWorkspaceId(workspaceId);
    const dtos = notes
      .map((n) => n.mapToDTO())
      .reduce(
        (acc, current) => {
          acc[current.id] = current;
          return acc;
        },
        {} as Record<string, NoteDTO>,
      );
    return { notes: dtos };
  },

  async getById(id) {
    const note = await ServiceContainer.noteService.getById(id);
    return { note: note ? note.mapToDTO() : null };
  },

  async update(id, dto) {
    const updated = await ServiceContainer.noteService.update(id, dto);
    const _dto = updated.mapToDTO();
    return { note: _dto };
  },

  async getDocument(id) {
    const document = await ServiceContainer.documentService.getNoteContent(id);
    return { document };
  },

  async setDocument(id, serializedDocument) {
    ServiceContainer.documentService.setNoteContent(id, serializedDocument);
    ServiceContainer.noteService.setModificationDate(id, new Date());
  },

  async duplicate(id: string) {
    const note = await ServiceContainer.noteService.duplicate(id);
    if (!note) throw new Error("Failed to duplicate note");
    return { note: note.mapToDTO() };
  },

  async export(
    fileContent: string,
    fileType: NoteExportFormat,
    title?: string,
  ) {
    const value = await dialog.showSaveDialog(
      BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0],
      {
        defaultPath: `${title ?? "document"}.${fileType}`,
        filters: [{ extensions: [fileType], name: FileFormatMap[fileType] }],
      },
    );
    if (value.canceled) return;
    const path = value.filePath;
    await writeFile(path, fileContent, "utf8");
  },
};
