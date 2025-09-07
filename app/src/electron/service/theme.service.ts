import { isTheme, Theme } from "@/common/theme";
import { DocumentFileStore, IDocumentStore } from "../lib/document-store";
import { THEME_DIR } from "../lib/paths";
import { tryParse } from "@common/json-util";

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

  async getThemes() {
    const ids = await this.themeStore.ls();
    const themes: Record<string, Theme> = {}
    for (const id of ids) {
      const themeString = await this.themeStore.read(id);
      const theme = this.parseTheme(themeString);
      if(!theme) continue;
      themes[id] = theme;
    }

    return themes;
  }
}
