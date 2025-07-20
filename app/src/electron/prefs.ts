import { DarkwriteUserSettings, SettingsModel } from "@common/settings";
import { SettingsService } from "./service/settings.service";
import { SettingsMigrator } from "@/common/settings-migrator";

export class ElectronPrefsModel {
  private static _prefs: DarkwriteUserSettings;
  private static settingsService = new SettingsService();

  static async initialize() {
    const settings = await this.settingsService.readSettingsFile();
    try {
      const settingsObj = JSON.parse(settings);
      const migrator = new SettingsMigrator(settingsObj);
      if(migrator.needsMigration()) {
        this._prefs = migrator.migrate();
        await this.save();
      }
      else this._prefs = settingsObj as DarkwriteUserSettings;
    }
    catch {
      this._prefs = SettingsModel.getDefaults();
      await this.save();
    }
    return this._prefs;
  }

  static get() {
    return this._prefs;
  }

  static override(prefs: DarkwriteUserSettings) {
    this._prefs = prefs;
  }

  static async save() {
    this.settingsService.writeSettingsFile(this.serialize());
  }

  private static serialize() {
    return JSON.stringify(this._prefs);
  }
}