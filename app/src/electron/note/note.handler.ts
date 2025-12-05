import { INoteAPI } from "@/common/contract";
import { NoteDTO } from "@/common/dto";
import { FileFormatMap, NoteExportFormat } from "@/common/note";
import { BrowserWindow, dialog } from "electron";
import { readFile, writeFile } from "fs-extra";
import { extname } from "path";
import { DocumentService } from "../service/document.service";
import { NoteQueryService } from "./note-query.service";
import { NoteService } from "./note.service";
import printToPdf from "../lib/print-to-pdf";

const documentService = new DocumentService();

export const ElectronNoteAPI: INoteAPI = {
  async create(dto) {
    const note = await NoteService.create(dto);
    return { note: note.mapToDTO() };
  },

  delete: NoteService.deleteById,

  async getAllByWorkspaceId(workspaceId) {
    const notes = await NoteQueryService.getAllByWorkspaceId(workspaceId);
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
    const note = await NoteQueryService.getById(id);
    return { note: note ? note.mapToDTO() : null };
  },

  async update(id, dto) {
    const updated = await NoteService.update(id, dto);
    const _dto = updated.mapToDTO();
    return { note: _dto };
  },

  async getDocument(id) {
    const document = await documentService.getNoteContent(id);
    return { document };
  },

  async setDocument(id, serializedDocument) {
    documentService.setNoteContent(id, serializedDocument);
    NoteService.setModificationDate(id, new Date());
  },

  async duplicate(id: string) {
    const note = await NoteService.duplicate(id);
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

  async exportPdf(html, title) {
    const buffer = await printToPdf(html, title);
    if (!buffer) return;
    const value = await dialog.showSaveDialog(
      BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0],
      {
        defaultPath: `${title ?? "document"}.pdf`,
        filters: [{ extensions: ["pdf"], name: "PDF Document" }],
      },
    );
    if (value.canceled) return;
    const path = value.filePath;
    await writeFile(path, Buffer.from(buffer.buffer));
  },

  async import() {
    const value = await dialog.showOpenDialog(
      BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0],
      {
        properties: ["openFile", "multiSelections"],
        filters: [
          { name: "Markdown files", extensions: ["md", "markdown"] },
          { name: "HTML files", extensions: ["html", "html"] },
          { name: "Darkwrite JSON", extensions: ["json"] },
        ],
      },
    );
    if (value.canceled) return { content: [], type: "json" };
    const filePaths = value.filePaths;
    const contents: string[] = [];
    const ext = extname(filePaths[0]).toLowerCase();

    let type: NoteExportFormat;
    if (ext === ".md" || ext === ".markdown") {
      type = "md";
    } else if (ext === ".html" || ext === ".htm") {
      type = "html";
    } else {
      type = "json";
    }

    for (const path of filePaths) {
      const content = await readFile(path, "utf8");
      contents.push(content);
    }
    return {
      content: contents,
      type,
    };
  },
};
