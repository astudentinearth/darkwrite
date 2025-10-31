import { Theme } from "@/common/theme";

export function applyTheme(theme: Theme) {
  const entries = Object.entries(theme.colors);
  for (const entry of entries) {
    const [cssVar, value] = entry;
    document.documentElement.style.setProperty(cssVar, value);
  }
}
