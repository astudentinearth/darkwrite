import * as NoteAPI from "@main/api/note.electron";
import * as SettingsAPI from "@main/api/settings.electron";
import { ImportAPI as FileImportAPI } from "@main/api/import.electron";
import { ThemeAPI } from "@main/api/theme.electron";
import { deepAssign, find, recursiveKeys } from "@darkwrite/common";
import { ipcMain } from "electron";
import {
  IPCMainListenerUnion,
  IPCMainListenerWithoutEvent,
  DarkwriteAPI,
  InferPreloadAPI,
  IPCHandler,
} from "@main/types";
import { BackupAPI, HTMLExporterAPI } from "@main/api/backup.electron";
import { EmbedAPI } from "@main/api/embed.electron";
import { showAppMenu } from "@main/menu";
import { Updater } from "../api/update.electron";

export const DarkwriteElectronAPI = {
  note: {
    /** Creates a new note.
     * @returns the Note object if successful, null if unsuccessful
     */
    create: new IPCHandler(false, NoteAPI.createNote),
    /**
     * Updates the stored JSON contents of the note.
     * @param id ID of the note
     * @param content stringified JSON to overwrite with
     * @returns
     */
    setContents: new IPCHandler(false, NoteAPI.setNoteContents),
    /**
     * Reads the stored JSON contents of the note.
     * @param id - ID of the note
     * @returns JSON content in string form
     */
    getContents: new IPCHandler(false, NoteAPI.getNoteContents),
    /**
     * Performs a database update for the given note. All fields are updated with the passed parameter.
     * @param note The partial note object to update with. An ID must be provided.
     */
    update: new IPCHandler(false, NoteAPI.updateNote),
    /**
     * Deletes a note **permanently**.
     * @param id ID of the note to delete
     */
    delete: new IPCHandler(false, NoteAPI.deleteNote),
    /**
     * Moves a note below another note, or to the top level
     * @param sourceID - ID of the note to move
     * @param destID - ID of the note to move into, or `undefined` if the top level is desired
     * @returns
     */
    move: new IPCHandler(false, NoteAPI.moveNote),
    /**
     * Gets all notes from the database.
     * @returns an array of notes.
     */
    getAll: new IPCHandler(false, NoteAPI.getAllNotes),
    /**
     * Finds a single note
     * @param id - ID of the note to look for
     * @returns the note if it exists, null if it doesn't exist or something goes wrong
     */
    getNote: new IPCHandler(false, NoteAPI.getNote),
    /**
     * Updates multiple notes at once
     * @param notes array of notes to update
     */
    saveAll: new IPCHandler(false, NoteAPI.saveNotes),
    /**
     * Shows a save file dialog to export a note
     * @param title note title to use as file name
     * @param content contents of the note
     * @param exportType format to export notes in.
     * @returns
     */
    export: new IPCHandler(false, NoteAPI.exportNote),
    /** Imports a file and returns its contents along with its content type. */
    import: new IPCHandler(false, FileImportAPI.importFile),
  },
  settings: {
    /** Reads saved user preferences from data directory */
    load: new IPCHandler(false, SettingsAPI.readUserPrefs),
    /** Saves user preferences to data directory */
    save: new IPCHandler(false, SettingsAPI.writeUserPrefs),
    /** @returns client specific information such as app and nodejs version.  */
    getClientInfo: new IPCHandler(false, SettingsAPI.getAppInfo),
    checkUpdate: new IPCHandler(false, Updater.checkUpdate)
  },
  theme: {
    /** Prompts the user to choose a theme file and imports it if the theme is valid. */
    import: new IPCHandler(false, ThemeAPI.import),
    /** Reads the contents of themes folder and loads all of them.
     * @returns all themes installed in current profile.
     */
    load: new IPCHandler(false, ThemeAPI.load),
    /** @returns the system accent color on Windows and macOS. If invoked on Linux, returns #000000
     *  @platform win32,darwin
     */
    getAccentColor: new IPCHandler(false, ThemeAPI.getSystemAccentColor),
    /**
     * Updates colors on titlebar buttons
     * @platform win32
     */
    setTitlebarSymbolColor: new IPCHandler(
      false,
      ThemeAPI.setTitlebarSymbolColor,
    ),
  },
  backup: {
    backupUserData: new IPCHandler(false, BackupAPI.backup),
    restore: new IPCHandler(false, BackupAPI.restore),
    openBackup: new IPCHandler(false, BackupAPI.openArchive),
  },
  embed: {
    create: new IPCHandler(false, EmbedAPI.create),
    resolve: new IPCHandler(false, EmbedAPI.resolve),
    createFromBuffer: new IPCHandler(false, EmbedAPI.createFromArrayBuffer),
  },
  exporter: {
    init: new IPCHandler(false, HTMLExporterAPI.initializeExporterCache),
    push: new IPCHandler(false, HTMLExporterAPI.pushToExporterCache),
    finish: new IPCHandler(false, HTMLExporterAPI.finishExport),
  },
  showAppMenu: new IPCHandler(false, showAppMenu),
} satisfies DarkwriteAPI;
export type DarkwritePreloadAPI = InferPreloadAPI<typeof DarkwriteElectronAPI>;

const register = (
  channel: string,
  withEvent: boolean,
  listener: IPCMainListenerUnion,
  _ipcMain = ipcMain,
) => {
  try {
    if (withEvent) {
      _ipcMain.handle(channel, listener);
    } else {
      _ipcMain.handle(channel, (_event, ...args) => {
        return (<IPCMainListenerWithoutEvent>listener)(...args);
      });
    }
  } catch {
    console.log("Failed to register ", channel);
  }
};

const registerAPI = (
  channelPrefix: string,
  api: DarkwriteAPI = DarkwriteElectronAPI,
) => {
  const handlerKeys = recursiveKeys(api, (val) => val instanceof IPCHandler);
  for (const keyPath of handlerKeys) {
    const handler = find(api, keyPath) as IPCHandler<boolean>;
    const channel = channelPrefix.concat(".").concat(keyPath.join("."));
    register(channel, handler.withEvent, handler.listener);
  }
};

export const buildPreloadObject = (
  api: DarkwriteAPI = DarkwriteElectronAPI,
) => {
  const handlerKeys = recursiveKeys(api, (val) => val instanceof IPCHandler);
  const obj = {};
  // strip everything with true to replace in the prelaod script later
  for (const keyPath of handlerKeys) {
    deepAssign(obj, keyPath, true);
  }
  return obj;
};

export const InitializeElectronAPI = () => {
  ipcMain.handle("$darkwrite.build-preload-api-object", async () => {
    return buildPreloadObject();
  });
  registerAPI("api");
}
