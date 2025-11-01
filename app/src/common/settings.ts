import _ from "lodash";

export type ThemeMode = "light" | "dark" | "system";

export const DEFAULT_THEME_SETTINGS = {
  themeMode: "dark" as ThemeMode,
  lightColorScheme: "darkwrite-catppuccin-latte" as string,
  darkColorScheme: "darkwrite-default" as string,
  accentColor: "#2867B8" as string,
  useSystemWindowFrame: false as boolean,
  useSystemAccentColor: false as boolean,
  fonts: {
    sans: "Inter, Helvetica, Arial, sans-serif" as string,
    serif: "Times New Roman, serif" as string,
    code: "JetBrains Mono, Cascadia Code, Noto Mono, monospace" as string,
    ui: "SF Pro Display, Inter, Segoe UI, Noto Sans, Cantarell, system-ui" as string,
  },
  experimental: {
    darwinCustomTitlebarEnabled: false as boolean,
  },
  customCSS: "" as string,
};

export const DEFAULT_EDITOR_SETTINGS = {
  spellcheckerEnabled: true as boolean,
  codeIndentSize: 4 as number,
  wordCountHudEnabled: false as boolean,
  disabledCommandItems: [] as string[],
};

export const DEFAULT_CLIENT_SETTINGS = {
  autoUpdateCheck: false as boolean,
  language: "en" as string,
};

export type ThemeSettings = typeof DEFAULT_THEME_SETTINGS;
export type EditorSettings = typeof DEFAULT_EDITOR_SETTINGS;
export type ClientSettings = typeof DEFAULT_CLIENT_SETTINGS;

export type DarkwriteUserSettings = {
  appearance: ThemeSettings;
  editor: EditorSettings;
  client: ClientSettings;
  version: 2;
};

export class SettingsModel {
  public static getDefaults(): DarkwriteUserSettings {
    return _.cloneDeep({
      appearance: DEFAULT_THEME_SETTINGS,
      client: DEFAULT_CLIENT_SETTINGS,
      editor: DEFAULT_EDITOR_SETTINGS,
      version: 2,
    });
  }

  public static mergeWith(settings: Partial<DarkwriteUserSettings>) {
    const defaults = this.getDefaults();
    const partial = _.cloneDeep(settings);
    _.merge(partial, defaults);
    return partial as DarkwriteUserSettings;
  }
}
