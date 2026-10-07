import { Theme } from "./theme";
import { DEFAULT_THEME_LIST } from "./themes";

it.each(DEFAULT_THEME_LIST)("built-in themes are valid", (theme) => {
  expect(Theme.parse(theme).orTee(console.error).isOk(), theme.id).toBe(true);
});
