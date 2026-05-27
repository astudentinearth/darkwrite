import type { Theme } from "@darkwrite/common";
import type { RootState, Selector } from "@/features/store/types";
import { createSelector } from "@reduxjs/toolkit";

export const selectAllThemes = (state: RootState) =>
  Object.values(state.theme.themes);

export const selectLightThemes = createSelector([selectAllThemes], (themes) =>
  themes.filter((t) => t.mode === "light"),
);

export const selectDarkThemes = createSelector([selectAllThemes], (themes) =>
  themes.filter((t) => t.mode === "dark"),
);

export const selectThemeById: Selector<string, Theme | undefined> = (
  state: RootState,
  id: string,
) => state.theme.themes[id];

export const selectFonts = (state: RootState) => state.theme.fonts;
