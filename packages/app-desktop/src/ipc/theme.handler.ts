import { IThemeAPI } from "@/common/contract";
import { BrowserWindow, dialog } from "electron";
import { ServiceContainer } from "../service-container";

export const ElectronThemeAPI: IThemeAPI = {
  async getThemes() {
    const themes = await ServiceContainer.themeService.getThemes();
    return { themes };
  },
  async importTheme() {
    const path = dialog.showOpenDialogSync(BrowserWindow.getAllWindows()[0], {
      filters: [{ name: "Darkwrite theme", extensions: ["json"] }],
      properties: ["dontAddToRecent"],
    });
    if (!path) return;
    await ServiceContainer.themeService.importTheme(path[0]);
  },
};
