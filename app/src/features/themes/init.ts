import { DarkwriteAPIClient } from "@/api/api-client";
import { setFonts, setThemes } from "./store/theme-actions";

export async function initializeThemes() {
  const response = await DarkwriteAPIClient.theme.getThemes();
  setThemes(Object.values(response.themes));
}

export async function initializeFonts() {
  const fonts = await DarkwriteAPIClient.desktop.getFontList();
  setFonts(fonts);
}
