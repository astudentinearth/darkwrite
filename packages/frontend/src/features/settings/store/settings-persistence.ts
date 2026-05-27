import type { DarkwriteUserSettings } from "@darkwrite/common";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import _ from "lodash";
import { DarkwriteAPIClient } from "@/api/api-client";
import type { RootState } from "@/features/store/types";
import { settingsSlice } from "./settings-slice";

export const settingsPersistenceMiddleware = createListenerMiddleware();
const DEBOUNCE_DELAY_MS = 300;

const _saveWithDebounce = _.debounce(
  async (settings: DarkwriteUserSettings) => {
    await DarkwriteAPIClient.settings.saveUserSettings(settings);
  },
  DEBOUNCE_DELAY_MS,
);

settingsPersistenceMiddleware.startListening({
  actionCreator: settingsSlice.actions.update,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const settings = state.settings;
    DarkwriteAPIClient.settings.saveUserSettings(settings);
  },
});

settingsPersistenceMiddleware.startListening({
  actionCreator: settingsSlice.actions.updateWithDebounce,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const settings = state.settings;
    _saveWithDebounce(settings);
  },
});
