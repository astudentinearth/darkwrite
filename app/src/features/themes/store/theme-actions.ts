import { Theme } from "@/common/theme";
import { themeSlice } from "./theme-slice";
import { store } from "@/features/store/redux";

export function setThemes(themes: Theme[]) {
  store.dispatch(themeSlice.actions.setThemes(themes));
}

