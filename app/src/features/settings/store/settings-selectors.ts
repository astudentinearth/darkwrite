import { useAppSelector } from "@/features/store/hooks";
import { RootState } from "@/features/store/types";
import { createSelector } from "@reduxjs/toolkit";

export const selectSettings = (state: RootState) => state.settings;

export const selectAppearanceSettings = createSelector(
  selectSettings,
  (settings) => settings.appearance,
);

export const selectFontSettings = createSelector(
  selectAppearanceSettings,
  (a) => a.fonts,
);

export const selectEditorSettings = createSelector(
  selectSettings,
  (settings) => settings.editor,
);

export const useSettings = () => useAppSelector(selectSettings);
export const useAppearanceSettings = () =>
  useAppSelector(selectAppearanceSettings);
export const useFontSettings = () => useAppSelector(selectFontSettings);
export const useEditorSettings = () => useAppSelector(selectEditorSettings);
