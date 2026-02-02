import { DarkwriteUserSettings } from "@/common/settings";
import { DeepPartial } from "@/common/ts-util";
import { store } from "@/features/store/redux";
import { settingsSlice } from "./settings-slice";

export function updateSettings(partial: DeepPartial<DarkwriteUserSettings>) {
  store.dispatch(settingsSlice.actions.update(partial));
}

/**
 * @returns the current settings state.
 */
export function getSettings() {
  return store.getState().settings;
}
