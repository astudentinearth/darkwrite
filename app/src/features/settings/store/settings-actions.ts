import { DarkwriteUserSettings } from "@/common/settings";
import { DeepPartial } from "@/common/ts-util";
import { store } from "@/features/store/redux";
import { settingsSlice } from "./settings-slice";
import { PageSize } from "@/common/pdf";

export function updateSettings(partial: DeepPartial<DarkwriteUserSettings>) {
  store.dispatch(settingsSlice.actions.update(partial));
}

export function updateSettingsDebounced(
  partial: DeepPartial<DarkwriteUserSettings>,
) {
  store.dispatch(settingsSlice.actions.updateWithDebounce(partial));
}

/**
 * @returns the current settings state.
 */
export function getSettings() {
  return store.getState().settings;
}

export function setPreferredPageSize(size: PageSize) {
  updateSettings({
    editor: {
      preferredPageSize: size,
    },
  });
}

export function updateAccentColor(color: string) {
  updateSettingsDebounced({ appearance: { accentColor: color } });
}
