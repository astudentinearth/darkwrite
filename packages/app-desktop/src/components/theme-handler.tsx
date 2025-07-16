import { useSettingsStore } from "@/context/settings-store";
import { useTheme } from "@/hooks/query";
import { DarkwriteDefault } from "@darkwrite/common";
import { hexToHslVariable, setGlobalStyle } from "@/lib/utils";
import { useEffect } from "react";
import { hsl } from "color-convert";
import { ThemesModel } from "@/lib/api/theme";

export function ThemeHandler() {
  const fonts = useSettingsStore((s) => s.settings.fonts);
  const { themes } = useTheme();
  const themeId = useSettingsStore((s) => s.settings.appearance.theme);
  const theme =
    themes.find((theme) => theme.id === themeId) ?? DarkwriteDefault;
  const accentColor = useSettingsStore(
    (s) => s.settings.appearance.accentColor,
  );
  const useSystemAccentColor = useSettingsStore(
    (s) => s.settings.appearance.useSystemAccentColor,
  );
  useEffect(() => {
    //console.log("Applying themes");
    const api = new ThemesModel();
    setGlobalStyle("font-family", fonts.ui);
    setGlobalStyle("--font-ui", fonts.ui || "system-ui");
    setGlobalStyle("--darkwrite-sans", fonts.sans);
    setGlobalStyle("--darkwrite-mono", fonts.code);
    setGlobalStyle("--darkwrite-serif", fonts.serif);
    if (useSystemAccentColor) {
      api.getSystemAccentColor().then((color) => {
        const accent = hexToHslVariable(color);
        setGlobalStyle("--primary", `hsl(${accent})`);
        setGlobalStyle("--accent", `hsl(${accent})`);
        setGlobalStyle("--primary-text", `hsl(${accent})`);
      });
    } else {
      const accent = hexToHslVariable(accentColor);
      setGlobalStyle("--primary", `hsl(${accent})`);
      setGlobalStyle("--accent", `hsl(${accent})`);
      setGlobalStyle("--primary-text", `hsl(${accent})`);
    }

    if (!theme) return;
    setGlobalStyle("--background", theme.background1);
    setGlobalStyle("--foreground", theme.foreground);
    setGlobalStyle("--view-1", theme.background2);
    setGlobalStyle("--view-2", theme.background3);
    setGlobalStyle("--card", theme.cardBackground);
    setGlobalStyle("--card-foreground", theme.cardForeground);
    setGlobalStyle("--popover", theme.popoverBackground);
    setGlobalStyle("--popover-foreground", theme.popoverForeground);
    setGlobalStyle("--secondary", theme.secondaryBackground);
    setGlobalStyle("--secondary-foreground", theme.secondaryForeground);
    setGlobalStyle("--muted", theme.mutedBackground);
    setGlobalStyle("--muted-foreground", theme.mutedForeground);
    setGlobalStyle("--destructive", theme.destructiveBackground);
    setGlobalStyle("--destructive-foreground", theme.destructiveForeground);
    setGlobalStyle("--disabled", theme.disabled);
    setGlobalStyle("--border", theme.border);
    setGlobalStyle("--ring", theme.focusRing);
    setGlobalStyle("--star", theme.star);
    for(const key in theme.cssVars) {
      if(theme.cssVars[key]) setGlobalStyle(key, theme.cssVars[key]);
    }
    if (window.api != null && window.api.theme.setTitlebarSymbolColor != null) {
      const fgHSLStr = theme.foreground.replace("%", "").split(" ");
      if (fgHSLStr.length !== 3) return;
      const fgHSL: [number, number, number] = [
        parseFloat(fgHSLStr[0]),
        parseFloat(fgHSLStr[1]),
        parseFloat(fgHSLStr[2]),
      ];
      const fgHEX = hsl.hex(fgHSL);
      //console.log(fgHEX);
      window.api.theme.setTitlebarSymbolColor(`#${fgHEX}`, theme.mode);
    }
  }, [fonts, theme, accentColor, useSystemAccentColor]);
  return <></>;
}
