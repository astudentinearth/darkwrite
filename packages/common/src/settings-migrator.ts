import { InvalidSettingsError } from "./error";
import { DarkwriteUserSettings, SettingsModel } from "./settings";
import { SettingsV1Schema } from "./settings-v1-schema";

export class SettingsMigrator {
  constructor(private settingsObj: unknown) {
    this.version = this.determineVersion();
  }
  private version: -1 | 1 | 2 = -1;
  determineVersion() {
    if (
      typeof this.settingsObj !== "object" ||
      this.settingsObj == null ||
      !("version" in this.settingsObj)
    ) {
      throw new InvalidSettingsError("Invalid settings file.");
    }

    if (this.settingsObj.version === "1") return 1;
    else if (this.settingsObj.version === 2) return 2;
    else return -1;
  }

  migrateToV2() {
    const v1 = this.settingsObj as SettingsV1Schema;
    const v2 = SettingsModel.getDefaults();

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

    this.settingsObj = v2;
    this.version = 2;
  }

  private migratorMap = {
    1: this.migrateToV2,
    2: () => this.settingsObj as DarkwriteUserSettings,
  };

  needsMigration() {
    return this.version < 2;
  }

  migrate() {
    if (this.version == -1)
      throw new InvalidSettingsError(`Cannot determine settings file version.`);
    this.migratorMap[this.version].call(this);
    return this.settingsObj as DarkwriteUserSettings;
  }
}
