import { Theme } from "@/common/theme";
import { themeSlice } from "./theme-slice";
import { store } from "@/features/store/redux";
import { Font } from "@/common/font";

export function setThemes(themes: Theme[]) {
  store.dispatch(themeSlice.actions.setThemes(themes));
}

export function setFonts(fonts: Font[]) {
  store.dispatch(themeSlice.actions.setFonts(fonts));
}
