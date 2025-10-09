import colorString, { ColorString } from "color-string";

const allowedKeys = [
  "--background",
  "--foreground",
  "--view-1",
  "--view-2",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--primary-text",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--disabled",
  "--border",
  "--input",
  "--radius",
  "--star",
  "--ring",
  "--editor-text-red",
  "--editor-text-orange",
  "--editor-text-yellow",
  "--editor-text-green",
  "--editor-text-cyan",
  "--editor-text-blue",
  "--editor-text-indigo",
  "--editor-text-purple",
  "--editor-text-pink",
  "--editor-highlight-red",
  "--editor-highlight-orange",
  "--editor-highlight-yellow",
  "--editor-highlight-green",
  "--editor-highlight-cyan",
  "--editor-highlight-blue",
  "--editor-highlight-indigo",
  "--editor-highlight-purple",
  "--editor-highlight-pink",
];

export type Theme = {
  id: string;
  name: string;
  mode: "light" | "dark";
  colors: {
    "--background"?: string;
    "--foreground"?: string;
    "--view-1"?: string;
    "--view-2"?: string;
    "--card"?: string;
    "--card-foreground"?: string;
    "--popover"?: string;
    "--popover-foreground"?: string;
    "--primary"?: string;
    "--primary-foreground"?: string;
    "--primary-text"?: string;
    "--secondary"?: string;
    "--secondary-foreground"?: string;
    "--muted"?: string;
    "--muted-foreground"?: string;
    "--accent"?: string;
    "--accent-foreground"?: string;
    "--destructive"?: string;
    "--destructive-foreground"?: string;
    "--disabled"?: string;
    "--border"?: string;
    "--input"?: string;
    "--star"?: string;
    "--ring"?: string;
    "--editor-text-red"?: string;
    "--editor-text-orange"?: string;
    "--editor-text-yellow"?: string;
    "--editor-text-green"?: string;
    "--editor-text-cyan"?: string;
    "--editor-text-blue"?: string;
    "--editor-text-indigo"?: string;
    "--editor-text-purple"?: string;
    "--editor-text-pink"?: string;
    "--editor-highlight-red"?: string;
    "--editor-highlight-orange"?: string;
    "--editor-highlight-yellow"?: string;
    "--editor-highlight-green"?: string;
    "--editor-highlight-cyan"?: string;
    "--editor-highlight-blue"?: string;
    "--editor-highlight-indigo"?: string;
    "--editor-highlight-purple"?: string;
    "--editor-highlight-pink"?: string;
  };
};

export function isValidCssColor(color: string) {
  return colorString.get(color) != null;
}

export function isTheme(maybeTheme: unknown): maybeTheme is Theme {
  if (typeof maybeTheme !== "object" || maybeTheme == null) return false;
  if (!("id" in maybeTheme && "name" in maybeTheme)) return false;
  if (typeof maybeTheme.id !== "string" || typeof maybeTheme.name !== "string")
    return false;
  if (!("colors" in maybeTheme)) return false;
  if (maybeTheme.colors == null || typeof maybeTheme.colors !== "object")
    return false;

  const colors = maybeTheme.colors as Record<string, string>;

  // check invalid key definitions
  for (const key in colors) {
    if (!allowedKeys.includes(key)) return false;
    const value = colors[key as keyof typeof maybeTheme.colors];
    if (!isValidCssColor(value)) return false;
  }
  return true;
}

export const cssTextColorVariables = allowedKeys.filter((key) =>
  key.startsWith("--editor-text-"),
);

export const csshighlightColorVariables = allowedKeys.filter((key) =>
  key.startsWith("--editor-highlight-"),
);

export function stripAlpha(rgbaHexColor: string) {
  return rgbaHexColor.substring(0, 6);
}
