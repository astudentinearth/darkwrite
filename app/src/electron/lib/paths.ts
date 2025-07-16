import { is } from "@electron-toolkit/utils";
import { app } from "electron";
import { join } from "node:path";
import fs from "node:fs";
import fse from "fs-extra"

//TODO: Refactor all IO into separate classes and deprecate this override later.
//TODO: Make this an actual option
const DATA_ROOT = process.env["DARKWRITE_ROOT_OVERRIDE"]
  ? process.env["DARKWRITE_ROOT_OVERRIDE"]
  : app.getPath("userData");

if(process.env["DARKWRITE_ROOT_OVERRIDE"]){
  console.warn("You have set a profile override with DARKWRITE_ROOT_OVERRIDE.")
}

/** The folder to store Darkwrite's user data.
 * It will point to `darkwrite-data/` on production and `darkwrite-data-nightly/` on development. */
export const DATA_DIR = join(
  DATA_ROOT,
  is.dev ? "darkwrite-data-nightly/" : "darkwrite-data/",
);
/** The folder to rollback from if a restore operation fails. */
export const DATA_SNAPSHOT_DIR = join(DATA_ROOT, "darkwrite-data-old");
/** The directory in which note contents are stored. */
export const NOTE_CONTENTS_DIR = join(DATA_DIR, "notes/");
/** Path to the SQLite database which holds the note entries. */
export const DB_PATH = join(DATA_DIR, "data.db");
/** Path to Darkwrite's settings.json file. */
export const SETTINGS_PATH = join(DATA_DIR, "settings.json");
/** Builds the path for a given note's JSON document
 * @param id ID of the note
 * @returns path to note's contents
 */
export const getNotePath = (id: string) =>
  join(NOTE_CONTENTS_DIR, `${id}.json`);

/** Temporary directory, as defined by Electron. */
export const CACHE_DIR = join(app.getPath("temp"));
/** Cache folder to use when exporting all notes in HTML format. */
export const EXPORTER_CACHE_DIR = join(CACHE_DIR, "dw-html-export/");
/** Cache folder to use when creating a full backup of Darkwrite data. */
export const BACKUP_CACHE_DIR = join(CACHE_DIR, "dw-backup");
/** Cache folder to use when extracting Darkwrite backups */
export const RESTORE_CACHE_DIR = join(CACHE_DIR, "dw-restore");
/** Directory to store user defined themes */
export const THEME_DIR = join(DATA_DIR, "themes/");
/** Directory to store user uploaded files */
export const EMBED_DIR = join(DATA_DIR, "embeds/");

export const SESSION_DATA_DIR = join(
  DATA_ROOT,
  is.dev ? "session-dev/" : "session/",
);

/** Ensures all data directories are ready. */
const initialize = async () => {
  console.log("Initializing directories")
  try {
    console.log("Checking permissions")
    fs.accessSync(DATA_ROOT, fse.constants.W_OK);
  } catch (err) {
    if (err != null) {
      console.error(
        `Darkwrite cannot access ${DATA_ROOT} : Make sure the directory exists and you have write permissions for that directory.`,
      );
      if (process.env["DARKWRITE_ROOT_OVERRIDE"] != "")
        console.error(
          `You have set the "DARKWRITE_ROOT_OVERRIDE" environment variable to a directory Darkwrite does not have permissions for. 
          Please ensure you can write into that directory.`,
        );
      throw err;
    }
  }
  await fse.ensureDir(DATA_ROOT);
  await fse.ensureDir(DATA_DIR);
  await fse.ensureDir(NOTE_CONTENTS_DIR);
  await fse.ensureDir(THEME_DIR);
  await fse.ensureDir(EMBED_DIR);
};

export const Paths = {
  DATA_DIR,
  DATA_SNAPSHOT_DIR,
  NOTE_CONTENTS_DIR,
  DB_PATH,
  SETTINGS_PATH,
  getNotePath,
  CACHE_DIR,
  EXPORTER_CACHE_DIR,
  BACKUP_CACHE_DIR,
  RESTORE_CACHE_DIR,
  THEME_DIR,
  EMBED_DIR,
  initialize,
  SESSION_DATA_DIR,
};
