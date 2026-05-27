import { useAppSelector } from "@/features/store/hooks";
import {
  selectAppearanceSettings,
  selectEditorSettings,
  selectFontSettings,
  selectSettings,
} from "../store/settings-selectors";

export const useSettings = () => useAppSelector(selectSettings);
export const useAppearanceSettings = () =>
  useAppSelector(selectAppearanceSettings);
export const useFontSettings = () => useAppSelector(selectFontSettings);
export const useEditorSettings = () => useAppSelector(selectEditorSettings);
