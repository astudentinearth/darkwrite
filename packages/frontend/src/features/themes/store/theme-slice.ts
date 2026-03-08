import { Font } from "@darkwrite/common";
import { Theme } from "@darkwrite/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeState = {
  themes: Record<string, Theme>;
  fonts: Font[];
};

const initialState: ThemeState = {
  themes: {},
  fonts: [],
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemes: (state, action: PayloadAction<Theme[]>) => {
      state.themes = action.payload.reduce(
        (acc, theme) => {
          acc[theme.id] = theme;
          return acc;
        },
        {} as Record<string, Theme>,
      );
    },
    setFonts: (state, action: PayloadAction<Font[]>) => {
      state.fonts = action.payload;
    },
  },
});
