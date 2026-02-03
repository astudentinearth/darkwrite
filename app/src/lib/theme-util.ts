import { Theme } from "@/common/theme";

export function applyTheme(theme: Theme) {
  const entries = Object.entries(theme.colors);
  if (theme.mode === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  for (const entry of entries) {
    const [cssVar, value] = entry;
    document.documentElement.style.setProperty(cssVar, value);
  }
}
