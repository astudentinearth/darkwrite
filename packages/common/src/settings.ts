import _ from "lodash";
import type { PageSize } from "./pdf";

export type ThemeMode = "light" | "dark" | "system";

export const DEFAULT_THEME_SETTINGS = {
  themeMode: "dark" as ThemeMode,
  lightColorScheme: "darkwrite-catppuccin-latte" as string,
  darkColorScheme: "darkwrite-default" as string,
  accentColor: "#2867B8" as string,
  useSystemWindowFrame: false as boolean,
  useSystemAccentColor: false as boolean,
  fonts: {
    sans: "system-ui" as string,
    serif: "ui-serif" as string,
    code: "ui-monospace" as string,
    ui: "system-ui" as string,
  },
  compactSidebar: true as boolean,
  experimental: {
    /** @deprecated no longer used */
    darwinCustomTitlebarEnabled: false as boolean,
  },
  customCSS: "" as string,
};

export const DEFAULT_EDITOR_SETTINGS = {
  spellcheckerEnabled: true as boolean,
  codeIndentSize: 4 as number,
  wordCountHudEnabled: false as boolean,
  disabledCommandItems: [] as string[],
  preferredPageSize: "A4" as PageSize,
  showTextDirectionControls: false as boolean,
  openFilesOnDoubleClick: false as boolean,
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

export const getDefaultUserSettings = () =>
  _.cloneDeep({
    appearance: DEFAULT_THEME_SETTINGS,
    client: DEFAULT_CLIENT_SETTINGS,
    editor: DEFAULT_EDITOR_SETTINGS,
    version: 2,
  }) satisfies DarkwriteUserSettings;

export const mergeUserSettings = (settings: Partial<DarkwriteUserSettings>) =>
  _.merge(getDefaultUserSettings(), settings) as DarkwriteUserSettings;
