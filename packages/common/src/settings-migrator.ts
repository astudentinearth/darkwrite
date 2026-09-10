import { type DarkwriteUserSettings, getDefaultUserSettings } from "./settings";
import type { SettingsV1Schema } from "./settings-v1-schema";

function migrateToV2(v1: SettingsV1Schema) {
  const v2 = getDefaultUserSettings();
  v2.appearance.accentColor = v1.appearance.accentColor;
  v2.appearance.experimental.darwinCustomTitlebarEnabled =
    v1.appearance.enableCustomWindowFrameOnDarwin;
  v2.appearance.fonts = v1.fonts;
  v2.appearance.useSystemWindowFrame = v1.appearance.useSystemWindowFrame;
  v2.appearance.useSystemAccentColor = v1.appearance.useSystemAccentColor;
  v2.appearance.darkColorScheme = v1.appearance.theme;
  v2.editor.codeIndentSize = v1.editor.codeBlockIndentSize;
  v2.client.autoUpdateCheck = v1.updateCheckEnabled;
  v2.client.language = "en";

  return v2;
}

export function migrateSettings(obj: unknown): DarkwriteUserSettings {
  if (typeof obj !== "object" || obj == null || !("version" in obj))
    return getDefaultUserSettings();

  if (obj.version === "1") return migrateToV2(obj as SettingsV1Schema);
  if (obj.version === 2) return obj as DarkwriteUserSettings;
  return getDefaultUserSettings();
}
