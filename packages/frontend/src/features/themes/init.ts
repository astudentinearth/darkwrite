import { DarkwriteAPIClient } from "@/api/api-client";
import { AppStore } from "../store/redux";
import { getThemeActions } from "./store/theme-actions";

export async function initializeThemes(store: AppStore) {
  const response = await DarkwriteAPIClient.theme.getThemes();
  getThemeActions(store).setThemes(Object.values(response.themes));
}

export async function initializeFonts(store: AppStore) {
  const fonts = await DarkwriteAPIClient.desktop.getFontList();
  getThemeActions(store).setFonts(fonts);
}
