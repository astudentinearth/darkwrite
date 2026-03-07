import { Theme } from "../theme";
import {
  CatppuccinMocha,
  CatppuccinLatte,
  CatppuccinMacchiato,
  CatppuccinFrappe,
} from "./catppuccin";
import { DarkwriteDim } from "./darkwrite-black";
import { DarkwriteDefault } from "./darkwrite-default";

export const DEFAULT_THEME_LIST = [
  DarkwriteDim,
  DarkwriteDefault,
  CatppuccinFrappe,
  CatppuccinMacchiato,
  CatppuccinLatte,
  CatppuccinMocha,
];
export const DEFAULT_THEMES: Record<string, Theme> = DEFAULT_THEME_LIST.reduce<
  Record<string, Theme>
>((acc: Record<string, Theme>, value) => {
  acc[value.id] = value;
  return acc;
}, {});

export { DarkwriteDefault } from "./darkwrite-default";
