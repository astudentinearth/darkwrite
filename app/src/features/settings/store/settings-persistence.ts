import { createListenerMiddleware } from "@reduxjs/toolkit";
import { settingsSlice } from "./settings-slice";
import { RootState } from "@/features/store/types";
import { DarkwriteAPIClient } from "@/api/api-client";
import _ from "lodash";
import { DarkwriteUserSettings } from "@/common/settings";

export const settingsPersistenceMiddleware = createListenerMiddleware();
const DEBOUNCE_DELAY_MS = 1000;

const _saveWithDebounce = _.debounce(
  async (settings: DarkwriteUserSettings) => {
    await DarkwriteAPIClient.settings.saveUserSettings(settings);
  },
  DEBOUNCE_DELAY_MS,
);

settingsPersistenceMiddleware.startListening({
  actionCreator: settingsSlice.actions.update,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const settings = state.settings;
    await DarkwriteAPIClient.settings.saveUserSettings(settings);
  },
});

settingsPersistenceMiddleware.startListening({
  actionCreator: settingsSlice.actions.updateWithDebounce,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const settings = state.settings;
    _saveWithDebounce(settings);
  },
});
