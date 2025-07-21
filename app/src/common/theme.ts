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
    "--editor-hightlight-red"?: string;
    "--editor-hightlight-orange"?: string;
    "--editor-hightlight-yellow"?: string;
    "--editor-hightlight-green"?: string;
    "--editor-hightlight-cyan"?: string;
    "--editor-hightlight-blue"?: string;
    "--editor-hightlight-indigo"?: string;
    "--editor-hightlight-purple"?: string;
    "--editor-hightlight-pink"?: string;
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
  if(!("colors" in maybeTheme)) return false;
  if(maybeTheme.colors == null || typeof maybeTheme.colors !== "object" ) return false;

  const colors = maybeTheme.colors as Record<string, string>;

  // check invalid key definitions
  for(const key in colors) {
    if(!allowedKeys.includes(key)) return false;
    const value = colors[key as keyof typeof maybeTheme.colors];
    if(!isValidCssColor(value)) return false;
  }
  return true;
}

export const cssTextColorVariables = allowedKeys.filter((key) =>
  key.startsWith("--editor-text-"),
);

export const cssHightlightColorVariables = allowedKeys.filter((key) =>
  key.startsWith("--editor-highlight-"),
);
