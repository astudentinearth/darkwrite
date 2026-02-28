import { useAppSelector } from "@/features/store/hooks";

export function useThemes() {
  const themes = useAppSelector((s) => s.theme.themes);
  return themes;
}
