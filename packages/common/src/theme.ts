import colorString from "color-string";
import z from "zod";
import { validateSchema } from "./result";

export function isValidCssColor(color: string) {
  return colorString.get(color) != null;
}

const zCssColor = z.stringFormat("css-color", isValidCssColor);

const colorSchema = z.object({
  "--background": zCssColor.optional(),
  "--foreground": zCssColor.optional(),
  "--view-1": zCssColor.optional(),
  "--view-2": zCssColor.optional(),
  "--primary": zCssColor.optional(),
  "--secondary": zCssColor.optional(),
  "--muted-foreground": zCssColor.optional(),
  "--destructive": zCssColor.optional(),
  "--destructive-foreground": zCssColor.optional(),
  "--border": zCssColor.optional(),
  "--star": zCssColor.optional(),
  "--editor-text-red": zCssColor.optional(),
  "--editor-text-orange": zCssColor.optional(),
  "--editor-text-yellow": zCssColor.optional(),
  "--editor-text-green": zCssColor.optional(),
  "--editor-text-cyan": zCssColor.optional(),
  "--editor-text-blue": zCssColor.optional(),
  "--editor-text-indigo": zCssColor.optional(),
  "--editor-text-purple": zCssColor.optional(),
  "--editor-text-pink": zCssColor.optional(),
  "--editor-highlight-red": zCssColor.optional(),
  "--editor-highlight-orange": zCssColor.optional(),
  "--editor-highlight-yellow": zCssColor.optional(),
  "--editor-highlight-green": zCssColor.optional(),
  "--editor-highlight-cyan": zCssColor.optional(),
  "--editor-highlight-blue": zCssColor.optional(),
  "--editor-highlight-indigo": zCssColor.optional(),
  "--editor-highlight-purple": zCssColor.optional(),
  "--editor-highlight-pink": zCssColor.optional(),
});

export const ThemeSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  mode: z.enum(["light", "dark"]),
  colors: colorSchema,
});

const allowedKeys = colorSchema.keyof().options;

export type Theme = z.output<typeof ThemeSchema>;

export const Theme = {
  parse: (value: unknown) => validateSchema(ThemeSchema)(value),
};

export const cssTextColorVariables = allowedKeys.filter((key) =>
  key.startsWith("--editor-text-"),
);

export const csshighlightColorVariables = allowedKeys.filter((key) =>
  key.startsWith("--editor-highlight-"),
);

export function stripAlpha(rgbaHexColor: string) {
  return rgbaHexColor.substring(0, 6);
}
