import {
  DarkwriteDefault,
  DarkwriteUserSettings,
  SettingsMigrator,
  SettingsModel,
  Theme,
} from "@darkwrite/common";
import { nativeTheme } from "electron";
import { SettingsService } from "./service/settings.service";
import { ThemeService } from "./service/theme.service";

export class ElectronPrefsModel {
  private static _prefs: DarkwriteUserSettings;
  private static settingsService = new SettingsService();
  private static _theme: Theme = DarkwriteDefault;

  static async initialize() {
    const settings = await this.settingsService.readSettingsFile();
    try {
      const settingsObj = JSON.parse(settings);
      const migrator = new SettingsMigrator(settingsObj);
      if (migrator.needsMigration()) {
        this._prefs = migrator.migrate();
        await this.save();
      } else this._prefs = settingsObj as DarkwriteUserSettings;
    } catch {
      this._prefs = SettingsModel.getDefaults();
      await this.save();
    }

    // fill missing keys
    this._prefs = SettingsModel.mergeWith(this._prefs);

    await this.reloadTheme();
    return this._prefs;
  }

  private static async reloadTheme() {
    const theme = await new ThemeService().getById(
      (this._prefs.appearance.themeMode !== "light" &&
        nativeTheme.shouldUseDarkColors) ||
        this._prefs.appearance.themeMode === "dark"
        ? this._prefs.appearance.darkColorScheme
        : this._prefs.appearance.lightColorScheme,
    );
    this._theme = theme ?? DarkwriteDefault;
  }

  static get() {
    return this._prefs;
  }

  static getTheme() {
    return this._theme;
  }

  static getDefaultWindowBackground() {
    return this._theme.mode === "dark" ? "#080808" : "#ffffff";
  }

  static override(prefs: DarkwriteUserSettings) {
    this._prefs = prefs;
    this.reloadTheme();
  }

  static async save() {
    this.settingsService.writeSettingsFile(this.serialize());
  }

  private static serialize() {
    return JSON.stringify(this._prefs);
  }
}
