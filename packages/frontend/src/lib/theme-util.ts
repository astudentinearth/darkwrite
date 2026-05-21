import { DarkwriteUserSettings } from "@darkwrite/common";
import { Theme } from "@darkwrite/common";

export function applyTheme(theme: Theme) {
  const entries = Object.entries(theme.colors);
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
