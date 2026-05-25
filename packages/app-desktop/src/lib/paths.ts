import { is } from "@electron-toolkit/utils";
import { app } from "electron";
import { join } from "node:path";
import { pathConfig } from "../metadata.json";
import log from "electron-log";
import { assertAccessibleSync, ensureDirs } from "./fs";

//TODO: Refactor all IO into separate classes and deprecate this override later.
//TODO: Make this an actual option
const DATA_ROOT = process.env["DARKWRITE_ROOT_OVERRIDE"]
  ? process.env["DARKWRITE_ROOT_OVERRIDE"]
  : app.getPath("userData");

if (process.env["DARKWRITE_ROOT_OVERRIDE"]) {
  log.warn("You have set a profile override with DARKWRITE_ROOT_OVERRIDE.");
}

const inRoot = (_path: string) => join(DATA_ROOT, _path);

/** The folder to store Darkwrite's user data.
 * It will point to `darkwrite-data/` on production and `darkwrite-data-nightly/` on development. */
export const DATA_DIR = join(
  DATA_ROOT,
  is.dev ? pathConfig.dir.data.development : pathConfig.dir.data.production,
);

const inData = (_path: string) => join(DATA_DIR, _path);

/** The folder to rollback from if a restore operation fails. */
export const DATA_SNAPSHOT_DIR = join(DATA_ROOT, pathConfig.dir.backup);
/** The directory in which note contents are stored. */
export const NOTE_CONTENTS_DIR = inData(pathConfig.dir.documentStore);
/** Path to the SQLite database which holds the note entries. */
export const DB_PATH = inData(pathConfig.dbFile);
/** Path to Darkwrite's settings.json file. */
export const SETTINGS_PATH = inData(pathConfig.settingsFile);
/** Builds the path for a given note's JSON document
 * @param id ID of the note
 * @returns path to note's contents
 */
export const getNotePath = (id: string) =>
  join(NOTE_CONTENTS_DIR, `${id}.json`);

/** Temporary directory, as defined by Electron. */
export const CACHE_DIR = join(app.getPath("temp"));
const inCache = (_path: string) => join(CACHE_DIR, _path);

/** Cache folder to use when exporting all notes in HTML format. */
export const EXPORTER_CACHE_DIR = join(
  CACHE_DIR,
  pathConfig.dir.cache.exporter,
);
/** Cache folder to use when creating a full backup of Darkwrite data. */
export const BACKUP_CACHE_DIR = join(CACHE_DIR, pathConfig.dir.cache.backup);
/** Cache folder to use when extracting Darkwrite backups */
export const RESTORE_CACHE_DIR = join(CACHE_DIR, pathConfig.dir.cache.restore);
/** Directory to store user defined themes */
export const THEME_DIR = join(DATA_DIR, pathConfig.dir.theme);
/** Directory to store user uploaded files */
export const EMBED_DIR = join(DATA_DIR, pathConfig.dir.blob);

export const ONBOARD_FLAG_PATH = join(DATA_DIR, ".onboarded");
export const VERSION_FLAG_PATH = join(DATA_DIR, ".version");
export const LOGS_DIR = join(DATA_ROOT, "logs/");
export const MIGRATION_LOG_FILE = join(LOGS_DIR, "migration.log");
export const MIGRATION_CACHE_DIR = inCache(pathConfig.dir.migration);

export const SESSION_DATA_DIR = join(
  DATA_ROOT,
  is.dev
    ? pathConfig.dir.session.development
    : pathConfig.dir.session.production,
);

function getPathError() {
  return `Darkwrite cannot access ${DATA_ROOT} : Make sure the directory exists and you have write permissions for that directory. ${
    process.env["DARKWRITE_ROOT_OVERRIDE"]
      ? `You have set the "DARKWRITE_ROOT_OVERRIDE" environment variable to a directory Darkwrite does not have permissions for.
          Please ensure you can write into that directory.`
      : ""
  }`;
}

const initialize = () =>
  assertAccessibleSync(DATA_ROOT)
    .orTee((error) => log.error(error.message, error.cause))
    .mapErr(getPathError)
    .asyncAndThen(() =>
      ensureDirs(DATA_ROOT, DATA_DIR, NOTE_CONTENTS_DIR, THEME_DIR, EMBED_DIR),
    );

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
  ONBOARD_FLAG_PATH,
  VERSION_FLAG_PATH,
  MIGRATION_CACHE_DIR,
  inCache,
  inData,
  inRoot,
  DATA_ROOT,
  LOGS_DIR,
  MIGRATION_LOG_FILE,
};
