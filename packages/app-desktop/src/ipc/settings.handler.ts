import { ISettingsAPI } from "@/common/contract";
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
