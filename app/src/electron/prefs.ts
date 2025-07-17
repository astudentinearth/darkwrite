import { DarkwriteUserSettings, SettingsModel } from "@common/settings";

export class ElectronPrefsModel {
  private static _prefs: DarkwriteUserSettings;
  static async initialize() {
    //TODO implement
    this._prefs = SettingsModel.getDefaults();
    return this._prefs;
  }
  static get() {
    return this._prefs;
  }
  static override(prefs: DarkwriteUserSettings) {
    this._prefs = prefs;
  }
}