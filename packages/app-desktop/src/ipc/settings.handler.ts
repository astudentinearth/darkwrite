import { ISettingsAPI } from "@darkwrite/common";
import { ElectronPrefsModel } from "../prefs";

export const ElectronSettingsAPI: ISettingsAPI = {
  async getUserSettings() {
    return ElectronPrefsModel.get();
  },

  async saveUserSettings(settings) {
    ElectronPrefsModel.override(settings);
    ElectronPrefsModel.save();
  },
};
