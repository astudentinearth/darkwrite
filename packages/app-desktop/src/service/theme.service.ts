import { isTheme, Theme } from "@darkwrite/common";
import log from "electron-log";
import { DocumentFileStore, IDocumentStore } from "../lib/document-store";
import { THEME_DIR } from "../lib/paths";
import { tryParse } from "@common/json-util";
import _ from "lodash";
import { DEFAULT_THEMES } from "@darkwrite/common";
import { readFile } from "fs-extra";
import { InvalidThemeError } from "@darkwrite/common";

export class ThemeService {
  constructor(
    private themeStore: IDocumentStore = new DocumentFileStore(THEME_DIR),
  ) {}

  async logInvalidTheme(id?: string, message?: string) {
    log.error(`Theme ${id} is invalid.`, message);
  }

  parseTheme(themeString: string, id?: string) {
    const jsonParseResult = tryParse(themeString);
    if (jsonParseResult.error) {
      this.logInvalidTheme(id, jsonParseResult.error.message);
      return null;
    }

    const jsonObject = jsonParseResult.result;
    const isValidTheme = isTheme(jsonObject);
    if (!isValidTheme) {
      this.logInvalidTheme(
        id,
        "The theme does not have the correct structure.",
      );
      return null;
    }

    return jsonObject;
  }

  async importTheme(path: string) {
    const themeString = await readFile(path, "utf-8");
    const theme = this.parseTheme(themeString);
    if (!theme) throw new InvalidThemeError(path);
    await this.themeStore.write(theme.id, themeString);
  }

  async getById(id: string) {
    const defaultTheme = DEFAULT_THEMES[id];
    if (defaultTheme) return _.cloneDeep(defaultTheme);

    try {
      const themeString = await this.themeStore.read(id);
      const theme = this.parseTheme(themeString, id);
      return theme;
    } catch (error) {
      log.error(`Failed to get theme ${id}.`, error);
      return null;
    }
  }

  async getThemes() {
    const ids = await this.themeStore.ls();
    const themes: Record<string, Theme> = _.cloneDeep(DEFAULT_THEMES);
    for (const id of ids) {
      const themeString = await this.themeStore.read(id);
      const theme = this.parseTheme(themeString, id);
      if (!theme) continue;
      themes[id] = theme;
    }

    return themes;
  }
}
