import { fsResult } from "@/lib/fs";
import {
  buildDwError,
  DarkwriteUserSettings,
  DEFAULT_THEMES,
  dwErr,
  DwResult,
  isTheme,
  parseJson,
  Theme,
} from "@darkwrite/common";
import { nativeTheme } from "electron";
import log from "electron-log";
import { readFile } from "fs-extra";
import _ from "lodash";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { IDocumentStore } from "../lib/document-store";

const logInvalidTheme = (id?: string, message?: string) =>
  log.error(`Theme ${id} is invalid.`, message);

const assertValidTheme = (obj: unknown): DwResult<Theme> =>
  isTheme(obj) ? ok(obj) : dwErr("Invalid theme.");

function parseTheme(themeString: string, id?: string) {
  return parseJson(themeString)
    .mapErr(() => buildDwError("Invalid JSON object"))
    .andThen(assertValidTheme)
    .orTee((err) => {
      logInvalidTheme(id, err.message);
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
      .orTee((err) => log.error(err.message, err.cause));
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
