import { Note, NoteExportType, UserSettings } from "@darkwrite/common";
import { ipcMain } from "electron";
import { readFile, writeFile } from "fs/promises";
import { openFile, saveFile } from "./api/dialog";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  getNoteContents,
  moveNote,
  saveNotes,
  setNoteContents,
  setTrashStatus,
  updateNote,
} from "./api/note";
import { readUserPrefs, writeUserPrefs } from "./api/settings";

// notes

ipcMain.handle(
  "create-note",
  async (_event, title: string, parent?: string) => {
    return await createNote(title, parent);
  },
);

ipcMain.handle(
  "set-note-contents",
  async (_event, id: string, content: string) => {
    await setNoteContents(id, content);
  },
);

ipcMain.handle("get-note-contents", async (_event, id: string) => {
  return await getNoteContents(id);
});

ipcMain.handle("delete-note", async (_event, id: string) => {
  await deleteNote(id);
});

ipcMain.handle(
  "move-note",
  async (_event, sourceID: string, destID: string) => {
    await moveNote(sourceID, destID);
  },
);

ipcMain.handle("update-note", async (_event, note: Note) => {
  await updateNote(note);
});

ipcMain.handle("get-all-notes", async () => {
  return await getAllNotes();
});

ipcMain.handle(
  "set-trash-status",
  async (_event, id: string, state: boolean) => {
    await setTrashStatus(id, state);
  },
);

// settings

ipcMain.handle("load-user-settings", async () => {
  return await readUserPrefs();
});

ipcMain.handle("save-user-settings", async (_event, data: UserSettings) => {
  writeUserPrefs(data);
});

ipcMain.handle("get-note", async (_event, id: string) => {
  return await getNote(id);
});

ipcMain.handle("save-notes", async (_event, notes: Note[]) => {
  await saveNotes(notes);
});

// dialog

ipcMain.handle(
  "export-note",
  async (
    _event,
    title: string,
    content: string,
    exportType: NoteExportType,
  ) => {
    const { canceled, path } = await saveFile({
      title: "Export note",
      buttonLabel: "Export",
      defaultPath: `${title}.${exportType}`,
    });
    if (canceled || !path) return;
    await writeFile(path, content);
  },
);

ipcMain.handle("import-html", async () => {
  const result = await openFile({
    title: "Import HTML",
    buttonLabel: "Import",
    filters: [
      {
        name: "HTML Document",
        extensions: ["html", "htm"],
      },
    ],
    properties: ["openFile"],
  });
  if (result.filePaths.length === 0) return "";
  const file = result.filePaths[0];
  const content = await readFile(file);
  return content.toString("utf-8");
});
