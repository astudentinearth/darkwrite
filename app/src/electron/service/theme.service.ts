import { isTheme, Theme } from "@/common/theme";
import { DocumentFileStore, IDocumentStore } from "../lib/document-store";
import { THEME_DIR } from "../lib/paths";
import { tryParse } from "@common/json-util";
import _ from "lodash";
import { DEFAULT_THEMES } from "@/common/themes";
import { readFile } from "fs-extra";

export class ThemeService {
  constructor(
    private themeStore: IDocumentStore = new DocumentFileStore(THEME_DIR),
  ) {}

  async logInvalidTheme(id?: string, message?: string) {
    console.error(`Theme ${id} is invalid.`, message);
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
    if (!theme) throw new Error("Invalid theme file.");
    await this.themeStore.write(theme.id, themeString);
  }

  async getThemes() {
    const ids = await this.themeStore.ls();
    const themes: Record<string, Theme> = _.cloneDeep(DEFAULT_THEMES);
    for (const id of ids) {
      const themeString = await this.themeStore.read(id);
      const theme = this.parseTheme(themeString);
      if (!theme) continue;
      themes[id] = theme;
    }

    return themes;
  }
}
