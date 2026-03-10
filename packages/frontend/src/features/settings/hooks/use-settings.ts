import { useAppSelector } from "@/features/store/hooks";
import {
  selectSettings,
  selectAppearanceSettings,
  selectFontSettings,
  selectEditorSettings,
} from "../store/settings-selectors";

export const useSettings = () => useAppSelector(selectSettings);
export const useAppearanceSettings = () =>
  useAppSelector(selectAppearanceSettings);
export const useFontSettings = () => useAppSelector(selectFontSettings);
export const useEditorSettings = () => useAppSelector(selectEditorSettings);
