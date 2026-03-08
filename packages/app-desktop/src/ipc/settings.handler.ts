import { ISettingsAPI } from "@darkwrite/common/contract";
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
