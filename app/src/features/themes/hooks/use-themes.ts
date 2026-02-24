import { useAppSelector } from "@/features/store/hooks";
import { selectAllThemes } from "../store/theme-selectors";

export function useThemes() {
  const themes = useAppSelector(s => s.theme.themes);
  return themes;
}

