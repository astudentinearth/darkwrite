import { DarkwriteAPIClient } from "@/api/api-client";
import { DarkwriteDefault } from "@/common/themes";
import { CatppuccinLatte } from "@/common/themes/catppuccin";
import { useAppearanceSettings } from "@/features/settings/store/settings-selectors";
import useSystemTheme from "@/hooks/use-system-theme";
import { applyTheme } from "@/lib/theme-util";
import { useThemes } from "@/query/use-themes";
import { useEffect } from "react";

export default function ThemeHandler() {
  const themes = useThemes().data;
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
    document.documentElement.style.setProperty(
      "--font-ui",
      appearanceSettings.fonts.ui,
    );
    document.documentElement.style.setProperty(
      "font-family",
      appearanceSettings.fonts.ui,
    );
    document.documentElement.style.setProperty(
      "--darkwrite-mono",
      appearanceSettings.fonts.code,
    );
    document.documentElement.style.setProperty(
      "--darkwrite-serif",
      appearanceSettings.fonts.serif,
    );
    document.documentElement.style.setProperty(
      "--darkwrite-sans",
      appearanceSettings.fonts.sans,
    );
  }, [appearanceSettings, systemTheme, themes]);

  return <></>;
}
