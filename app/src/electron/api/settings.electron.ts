import {
  DEFAULT_USER_SETTINGS,
  DarkwriteDesktopClientInfo,
  UserSettings,
  buildUserSettings,
} from "@darkwrite/common";
import log from "electron-log/main.js";
import { FileHandle, open, writeFile } from "fs/promises";
import { SETTINGS_PATH } from "../lib/paths";
import { isNodeError, isValidJSON } from "../util";
import { app } from "electron";
import os from "os";

const filename = SETTINGS_PATH;

export async function createSettingsFile() {
  log.info("Creating user settings file");
  const defaults = JSON.stringify(DEFAULT_USER_SETTINGS); // write defaults
  await writeFile(filename, defaults, "utf-8");
}

export async function readUserPrefs() {
  log.debug("Loading user settings");
  try {
    let handle: FileHandle;
    try {
      handle = await open(filename, "r+");
    } catch (error) {
      if (!isNodeError(error)) {
        throw error;
      }
      if (error.code === "ENOENT") {
        // the file might not be there
        log.info("Settings file not found.");
        await createSettingsFile();
        log.debug("Trying to open file again");
        handle = await open(filename, "r+");
      } else throw error;
    }
    log.debug("Reading file contents");
    const data = await handle.readFile("utf8");
    if (!isValidJSON(data)) {
      log.warn("Settings file was broken. Recreating the file");
      await createSettingsFile();
      handle.close();
      return DEFAULT_USER_SETTINGS;
    } else {
      const json = JSON.parse(data);
      const prefs = buildUserSettings(json);
      handle.close();
      return prefs;
    }
  } catch (err) {
    log.error("Something bad happened while reading user settings.");
    if (isNodeError(err)) log.error(err.message);
    return null;
  }
}

export async function writeUserPrefs(prefs: UserSettings) {
  try {
    await writeFile(filename, JSON.stringify(prefs));
  } catch (err) {
    log.error("Something bad happened while saving user settings.");
    if (isNodeError(err)) log.error(err.message);
  }
}

export function getAppInfo(): DarkwriteDesktopClientInfo {
  return {
    isPackaged: app.isPackaged,
    version: app.getVersion(),
    os: `${os.type()} ${os.release()}`,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
  };
}
