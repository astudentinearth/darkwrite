import { fsResult } from "@/lib/fs";
import {
  DarkwriteUserSettings,
  DEFAULT_THEMES,
  isTheme,
  parseJson,
  Theme,
  ThemeError,
} from "@darkwrite/common";
import log from "electron-log";
import { readFile } from "fs-extra";
import _ from "lodash";
import { err, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { IDocumentStore } from "../lib/document-store";
import { nativeTheme } from "electron";

const logInvalidTheme = (id?: string, message?: string) =>
  log.error(`Theme ${id} is invalid.`, message);

const assertValidTheme = (obj: unknown): Result<Theme, ThemeError> =>
  isTheme(obj) ? ok(obj) : err({ type: "invalid-theme" });

function parseTheme(themeString: string, id?: string) {
  return parseJson(themeString)
    .andThen(assertValidTheme)
    .orTee((err) => {
      if (err.type === "invalid-json-string")
        logInvalidTheme(id, "Invalid JSON object.");
      else logInvalidTheme(id, "Invalid theme structure.");
    });
}

function mapThemes(themes: Theme[]) {
  const map: Record<string, Theme> = _.cloneDeep(DEFAULT_THEMES);
  for (const t of themes) map[t.id] = t;
  return map;
}

export function ThemeService(
  themeStore: IDocumentStore,
  getSettings: () => DarkwriteUserSettings,
) {
  const importTheme = (filePath: string) =>
    fsResult(readFile(filePath, "utf-8"))
      .andThen(parseTheme)
      .andThen((json) => themeStore.write(json.id, JSON.stringify(json)));

  const getById = (id: string) => {
    const builtinVariant = DEFAULT_THEMES[id];
    if (builtinVariant) return okAsync(_.cloneDeep(builtinVariant));
    return themeStore
      .read(id)
      .andThen(parseTheme)
      .mapErr((err) =>
        err.type === "document-not-found"
          ? ({ type: "theme-not-found", id } satisfies ThemeError)
          : err,
      )
      .orTee((err) => {
        switch (err.type) {
          case "path-error":
          case "fs-error":
            log.error("Filesystem error while fetching theme");
            break;
        }
      });
  };

  const getThemes = () =>
    themeStore
      .ls()
      .andThen((ids) =>
        ResultAsync.combine(ids.map((id) => themeStore.read(id))),
      )
      .andThen((themeStrings) =>
        Result.combine(
          themeStrings.map((str) => parseTheme(str).orElse(() => ok(null))),
        ),
      )
      .map((themes) => themes.filter((t) => t != null))
      .map(mapThemes);

  const getDefaultWindowBackground = () => {
    const settings = getSettings().appearance;
    const themeMode =
      settings.themeMode === "system"
        ? nativeTheme.shouldUseDarkColors
          ? "dark"
          : "light"
        : settings.themeMode;
    return themeMode === "dark" ? "#080808" : "#ffffff";
  };

  return {
    getThemes,
    importTheme,
    getById,
    getDefaultWindowBackground,
  };
}

export type IThemeService = ReturnType<typeof ThemeService>;
