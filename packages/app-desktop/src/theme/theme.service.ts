import {
  buildDwError,
  type DarkwriteUserSettings,
  DEFAULT_THEMES,
  parseJson,
  Theme,
} from "@darkwrite/common";
import { nativeTheme } from "electron";
import log from "electron-log";
import _ from "lodash";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { readFileUtf8 } from "@/lib/fs";
import type { IDocumentStore } from "../lib/document-store";

const logInvalidTheme = (id?: string, message?: string) =>
  log.error(`Theme ${id} is invalid.`, message);

const parseTheme = (themeString: string, id?: string) =>
  parseJson(themeString)
    .mapErr(() => buildDwError("Invalid JSON object"))
    .andThen(Theme.parse)
    .orTee((err) => {
      logInvalidTheme(id, err.message);
    });

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
    readFileUtf8(filePath)
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
