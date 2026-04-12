import { INoteAPI } from "@darkwrite/common";
import { CreateNoteDTOSchema, UpdateNoteDTOSchema } from "@darkwrite/common";
import { FileFormatMap, NoteExportFormat } from "@darkwrite/common";
import { BrowserWindow, dialog } from "electron";
import { readFile, writeFile } from "fs-extra";
import { extname } from "path";
import printToPdf from "../lib/print-to-pdf";
import { DocumentService } from "../service/document.service";
import { IPCHandler } from "../types/ipc-handler";
import { NoteQueryService } from "./note-query.service";
import { mapNotesToDTO } from "./note-util";
import { NoteService } from "./note.service";
import { db } from "@/db";
import { noteToDto } from "./note-mapper";

const documentService = new DocumentService();
const noteService = new NoteService(db);

export const ElectronNoteAPI: INoteAPI = {
  async create(dto) {
    const note = await noteService.create(CreateNoteDTOSchema.parse(dto));
    return { note: noteToDto(note) };
  },

  delete: (id) => noteService.deleteById(id),

  async getAllByWorkspaceId(workspaceId) {
    const notes = await NoteQueryService.getAllByWorkspaceId(workspaceId);
    const dtos = mapNotesToDTO(notes);
    return { notes: dtos };
  },

  async getFavorites(workspaceId: string) {
    const notes = await NoteQueryService.getFavorites(workspaceId);
    const dtos = mapNotesToDTO(notes);
    return { notes: dtos };
  },

  async favorite(noteId: string, aboveNoteId?: string | null) {
    const note = noteToDto(await noteService.favorite(noteId, aboveNoteId));
    return { note };
  },

  async unfavorite(noteId: string) {
    const note = noteToDto(await noteService.unfavorite(noteId));
    return { note };
  },

  async getTrashed(workspaceId: string) {
    const notes = await NoteQueryService.getTrashed(workspaceId);
    const dtos = mapNotesToDTO(notes);
    return { notes: dtos };
  },

  async search(workspaceId: string, query: string) {
    const notes = await NoteQueryService.search(workspaceId, query);
    const dtos = mapNotesToDTO(notes);
    return { notes: dtos };
  },

  async moveToTrash(noteId: string) {
    const note = noteToDto(await noteService.moveToTrash(noteId));
    return { note };
  },

  async restoreFromTrash(noteId: string) {
    const note = noteToDto(await noteService.restoreFromTrash(noteId));
    return { note };
  },

  async getRecents(workspaceId: string) {
    const notes = await NoteQueryService.getRecents(workspaceId);
    const dtos = mapNotesToDTO(notes);
    return { notes: dtos };
  },

  async getByParentId(workspaceId: string, parentId: string | null) {
    const notes = await NoteQueryService.getByParentId(workspaceId, parentId);
    const dtos = mapNotesToDTO(notes);
    return { notes: dtos };
  },

  async getById(id) {
    const note = await NoteQueryService.getById(id);
    return { note: note ? noteToDto(note) : null };
  },

  async update(id, dto) {
    const updated = await noteService.update(
      id,
      UpdateNoteDTOSchema.parse(dto),
    );
    if (!updated) throw new Error("Failed to update note");
    const _dto = noteToDto(updated);
    return { note: _dto };
  },

  async move(dto) {
    await noteService.move(dto);
    const note = await NoteQueryService.getById(dto.sourceId);
    return { note: note ? noteToDto(note) : null };
  },

  async getDocument(id) {
    const document = await documentService.getNoteContent(id);
    return { document };
  },

  async setDocument(id, serializedDocument) {
    documentService.setNoteContent(id, serializedDocument);
    noteService.setModificationDate(id, new Date());
  },

  async duplicate(id: string) {
    const note = await noteService.duplicate(id);
    if (!note) throw new Error("Failed to duplicate note");
    return { note: noteToDto(note) };
  },

  async getParentTree(id: string) {
    const tree = await NoteQueryService.getParentTree(id);
    return {
      parents: tree.map((note) => noteToDto(note)),
    };
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

  async exportPdf(html, title, pageSize = "A4") {
    const buffer = await printToPdf(html, title, pageSize);
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

export const NoteApiBridge = {
  create: new IPCHandler(false, ElectronNoteAPI.create),
  delete: new IPCHandler(false, ElectronNoteAPI.delete),
  getAllByWorkspaceId: new IPCHandler(
    false,
    ElectronNoteAPI.getAllByWorkspaceId,
  ),
  favorite: new IPCHandler(false, ElectronNoteAPI.favorite),
  unfavorite: new IPCHandler(false, ElectronNoteAPI.unfavorite),
  getFavorites: new IPCHandler(false, ElectronNoteAPI.getFavorites),
  getParentTree: new IPCHandler(false, ElectronNoteAPI.getParentTree),
  getTrashed: new IPCHandler(false, ElectronNoteAPI.getTrashed),
  moveToTrash: new IPCHandler(false, ElectronNoteAPI.moveToTrash),
  restoreFromTrash: new IPCHandler(false, ElectronNoteAPI.restoreFromTrash),
  search: new IPCHandler(false, ElectronNoteAPI.search),
  getRecents: new IPCHandler(false, ElectronNoteAPI.getRecents),
  getByParentId: new IPCHandler(false, ElectronNoteAPI.getByParentId),
  getById: new IPCHandler(false, ElectronNoteAPI.getById),
  update: new IPCHandler(false, ElectronNoteAPI.update),
  getDocument: new IPCHandler(false, ElectronNoteAPI.getDocument),
  setDocument: new IPCHandler(false, ElectronNoteAPI.setDocument),
  duplicate: new IPCHandler(false, ElectronNoteAPI.duplicate),
  move: new IPCHandler(false, ElectronNoteAPI.move),
  export: new IPCHandler(false, ElectronNoteAPI.export),
  exportPdf: new IPCHandler(false, ElectronNoteAPI.exportPdf),
  import: new IPCHandler(false, ElectronNoteAPI.import),
};
