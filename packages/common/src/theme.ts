export type Theme = {
  id: string;
  name: string;
  mode: "light" | "dark";
  background1: string;
  background2: string;
  background3: string;
  foreground: string;
  cardBackground: string;
  cardForeground: string;
  popoverBackground: string;
  popoverForeground: string;
  secondaryBackground: string;
  secondaryForeground: string;
  mutedBackground: string;
  mutedForeground: string;
  destructiveBackground: string;
  destructiveForeground: string;
  disabled: string;
  border: string;
  focusRing: string;
  star: string;
  cssVars: {[key: string]: string};
};


export function isTheme(maybeTheme: unknown): maybeTheme is Theme {
  if (typeof maybeTheme !== "object") return false;
  if (!("id" in maybeTheme && "name" in maybeTheme)) return false;
  if (typeof maybeTheme.id !== "string" || typeof maybeTheme.name !== "string")
    return false;
  return true;
}

export const cssTextColorVariables = [
  "--editor-text-red",
  "--editor-text-orange",
  "--editor-text-yellow",
  "--editor-text-green",
  "--editor-text-cyan",
  "--editor-text-blue",
  "--editor-text-indigo",
  "--editor-text-purple",
  "--editor-text-pink",
];

export const cssHightlightColorVariables = [
  "--editor-hightlight-red",
  "--editor-hightlight-orange",
  "--editor-hightlight-yellow",
  "--editor-hightlight-green",
  "--editor-hightlight-cyan",
  "--editor-hightlight-blue",
  "--editor-hightlight-indigo",
  "--editor-hightlight-purple",
  "--editor-hightlight-pink",
];