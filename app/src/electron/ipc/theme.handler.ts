import { IThemeAPI } from "@/common/contract";
import { ServiceContainer } from "../service-container";

export const ElectronThemeAPI: IThemeAPI = {
  async getThemes() {
    const themes = await ServiceContainer.themeService.getThemes();
    return {themes}
  }
}