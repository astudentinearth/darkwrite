import { DarkwriteAPIClient } from "@/api/api-client";
import type { AppStore } from "../store/redux";
import { getThemeActions } from "./store/theme-actions";

export function initializeThemes(store: AppStore) {
  return DarkwriteAPIClient.theme
    .getThemes()
    .map(({ themes }) =>
      getThemeActions(store).setThemes(Object.values(themes)),
    )
    .map(() => store);
}

export function initializeFonts(store: AppStore) {
  return DarkwriteAPIClient.desktop
    .getFontList()
    .map((fonts) => getThemeActions(store).setFonts(fonts))
    .map(() => store);
}
