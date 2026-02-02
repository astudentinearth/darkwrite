import { DarkwriteUserSettings } from "@/common/settings";
import { DeepPartial } from "@/common/ts-util";
import { InitialUserSettings } from "@/init";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

export const SETTINGS_SLICE_NAME = "settings";

export const settingsSlice = createSlice({
  initialState: InitialUserSettings.settings,
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
