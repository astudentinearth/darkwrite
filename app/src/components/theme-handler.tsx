import { DarkwriteDefault } from "@/common/themes";
import { CatppuccinLatte } from "@/common/themes/catppuccin";
import useSystemTheme from "@/hooks/use-system-theme";
import { useSettings } from "@/query/use-settings";
import { useThemes } from "@/query/use-themes";

export default function ThemeHandler() {
  const themes = useThemes().data;
  const appearanceSettings = useSettings().data.appearance;
  const accentColor = appearanceSettings.accentColor;
  const systemTheme = useSystemTheme();
  const themeMode = appearanceSettings.themeMode === "system" ? systemTheme : appearanceSettings.themeMode;
  const themeId = themeMode === "dark" ? appearanceSettings.darkColorScheme : appearanceSettings.lightColorScheme;
  const theme = themes[themeId] ?? (themeMode === "dark" ? DarkwriteDefault : CatppuccinLatte);
  const entries = Object.entries(theme.colors);
  for(const entry of entries) {
    const [cssVar, value] = entry;
    document.documentElement.style.setProperty(cssVar, value);
  }
  document.documentElement.style.setProperty("--primary", accentColor);
  document.documentElement.style.setProperty("--primary-text", accentColor);
  return <></>
}