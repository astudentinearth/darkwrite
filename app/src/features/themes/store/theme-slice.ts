import { Theme } from "@/common/theme"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeState = {
  themes: Record<string, Theme>;
}

const initialState: ThemeState = {
  themes: {}
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemes: (state, action: PayloadAction<Theme[]>) => {
      state.themes = action.payload.reduce((acc, theme) => {
        acc[theme.id] = theme;
        return acc;
      }, {} as Record<string, Theme>);
    }
  }
});


