import { readFile, writeFile } from "node:fs/promises";
import {
  type DarkwriteUserSettings,
  getDefaultUserSettings,
  migrateSettings,
  parseJson,
} from "@darkwrite/common";
import log from "electron-log";
import _ from "lodash";
import { ok } from "neverthrow";
import { assertExists, fsResult } from "@/lib/fs";

const DEFAULT_SETTINGS_STR = JSON.stringify(getDefaultUserSettings());

export function SettingsService(settingsFilePath: string) {
  let currentSettings: DarkwriteUserSettings = getDefaultUserSettings();

  /** @internal */
  const _writeSettingsFile = (contents: string) =>
    fsResult(writeFile(settingsFilePath, contents));

  /** @internal */
  const _readSettingsFile = () =>
    assertExists(settingsFilePath)
      .andThen(() => fsResult(readFile(settingsFilePath, "utf-8")))
      .orTee((error) =>
        log.error(
          "Could not read settings file. Attempting to re-create it.",
          error,
        ),
      )
      .orElse(() =>
        _writeSettingsFile(DEFAULT_SETTINGS_STR).map(
          () => DEFAULT_SETTINGS_STR,
        ),
      );

  const override = (settings: DarkwriteUserSettings) => {
    currentSettings = _.cloneDeep(settings);
    return ok();
  };

  const loadFromFile = () =>
    _readSettingsFile()
      .andThen(parseJson)
      .map(migrateSettings)
      .orElse(() => ok(getDefaultUserSettings()))
      .andThen(override);

  const getSettings = () => currentSettings;

  const saveSettings = () =>
    _writeSettingsFile(JSON.stringify(currentSettings));

  const setSettings = (settings: DarkwriteUserSettings) =>
    override(settings).asyncAndThen(() => saveSettings());

  return { loadFromFile, getSettings, setSettings };
}

export type ISettingsService = ReturnType<typeof SettingsService>;
