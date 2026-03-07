import { DarkwriteAPIClient } from "@/api/api-client";
import { DarkwriteDefault } from "@/common/themes";
import { CatppuccinLatte } from "@/common/themes/catppuccin";
import { useThemes } from "@/features/themes/hooks/use-themes";
import useSystemTheme from "@/features/themes/hooks/use-system-theme";
import { applyFonts, applyTheme } from "@/lib/theme-util";
import { useEffect } from "react";
import { useAppearanceSettings } from "@/features/settings/hooks/use-settings";

export default function ThemeHandler() {
  const themes = useThemes();
  const appearanceSettings = useAppearanceSettings();
  const systemTheme = useSystemTheme();

  useEffect(() => {
    const setAccent = async () => {
      let accentColor = appearanceSettings.accentColor;
      if (appearanceSettings.useSystemAccentColor) {
        accentColor = `#${await DarkwriteAPIClient.desktop.getSystemAccentColor()}`;
      }
      document.documentElement.style.setProperty("--primary", accentColor);
      document.documentElement.style.setProperty("--primary-text", accentColor);
    };
    setAccent();
  }, [appearanceSettings.accentColor, appearanceSettings.useSystemAccentColor]);

  useEffect(() => {
    const themeMode =
      appearanceSettings.themeMode === "system"
        ? systemTheme
        : appearanceSettings.themeMode;
    const themeId =
      themeMode === "dark"
        ? appearanceSettings.darkColorScheme
        : appearanceSettings.lightColorScheme;
    const theme =
      themes[themeId] ??
      (themeMode === "dark" ? DarkwriteDefault : CatppuccinLatte);

    applyTheme(theme);
    applyFonts(appearanceSettings.fonts);
  }, [appearanceSettings, systemTheme, themes]);

  return <></>;
}
