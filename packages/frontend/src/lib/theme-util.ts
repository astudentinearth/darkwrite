import {
  CatppuccinLatte,
  DarkwriteDefault,
  type DarkwriteUserSettings,
  type Theme,
} from "@darkwrite/common";
import _ from "lodash";

/** Baseline a theme against a fallback depending on mode. Dark themes
 * will get "Darkwrite Default" as the fallback, while light themes
 * will get "Catppuccin Latte". The returned theme is guaranteed to
 * contain all theme variables. */
const produceCompleteTheme = (theme: Theme) =>
  _.merge(
    _.cloneDeep(theme.mode === "dark" ? DarkwriteDefault : CatppuccinLatte),
    theme,
  );

export function applyTheme(theme: Theme) {
  const entries = Object.entries(produceCompleteTheme(theme).colors);
  if (theme.mode === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  for (const entry of entries) {
    const [cssVar, value] = entry;
    document.documentElement.style.setProperty(cssVar, value);
  }
}

export function applyFonts(
  fontSettings: DarkwriteUserSettings["appearance"]["fonts"],
) {
  document.documentElement.style.setProperty("--font-ui", fontSettings.ui);
  document.documentElement.style.setProperty("font-family", fontSettings.ui);
  document.documentElement.style.setProperty(
    "--darkwrite-mono",
    `${fontSettings.code}, ui-monospace, monospace`,
  );
  document.documentElement.style.setProperty(
    "--darkwrite-serif",
    `${fontSettings.serif}, ui-serif, serif`,
  );
  document.documentElement.style.setProperty(
    "--darkwrite-sans",
    `${fontSettings.sans}, system-ui, sans-serif`,
  );
}
