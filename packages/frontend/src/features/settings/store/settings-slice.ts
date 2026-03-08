import { DarkwriteUserSettings, SettingsModel } from "@darkwrite/common";
import { DeepPartial } from "@darkwrite/common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

export const SETTINGS_SLICE_NAME = "settings";

export const settingsSlice = createSlice({
  initialState: SettingsModel.getDefaults(),
  name: SETTINGS_SLICE_NAME,
  reducers: {
    update(state, action: PayloadAction<DeepPartial<DarkwriteUserSettings>>) {
      _.merge(state, action.payload);
    },
    updateWithDebounce(
      state,
      action: PayloadAction<DeepPartial<DarkwriteUserSettings>>,
    ) {
      _.merge(state, action.payload);
    },
    initialize(_state, action: PayloadAction<DarkwriteUserSettings>) {
      return action.payload;
    },
  },
});
