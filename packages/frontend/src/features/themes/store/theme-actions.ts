import type { Font, Theme } from "@darkwrite/common";
import type { AppStore } from "@/features/store/redux";
import { themeSlice } from "./theme-slice";

export function getThemeActions(store: AppStore) {
  function setThemes(themes: Theme[]) {
    store.dispatch(themeSlice.actions.setThemes(themes));
  }

  function setFonts(fonts: Font[]) {
    store.dispatch(themeSlice.actions.setFonts(fonts));
  }

  return {
    setThemes,
    setFonts,
  };
}
