import { IThemeAPI } from "@/common/contract";
import { ServiceContainer } from "../service-container";

export const ElectronThemeAPI: IThemeAPI = {
  async getThemes() {
    return ServiceContainer.themeService.getThemes();
  }
}