import { Theme } from "@darkwrite/common";
import { themeSlice } from "./theme-slice";
import { AppStore } from "@/features/store/redux";
import { Font } from "@darkwrite/common";

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
