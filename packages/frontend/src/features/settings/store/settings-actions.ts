import type { PageSize } from "@darkwrite/common";
import type { DarkwriteUserSettings } from "@darkwrite/common";
import type { DeepPartial } from "@darkwrite/common";
import type { AppStore } from "@/features/store/redux";
import { settingsSlice } from "./settings-slice";
import { useMemo } from "react";
import { useAppStore } from "@/features/store/hooks";

export const getSettingsActions = (store: AppStore) => {
  function updateSettings(partial: DeepPartial<DarkwriteUserSettings>) {
    store.dispatch(settingsSlice.actions.update(partial));
  }

  function updateSettingsDebounced(
    partial: DeepPartial<DarkwriteUserSettings>,
  ) {
    store.dispatch(settingsSlice.actions.updateWithDebounce(partial));
  }

  /**
   * @returns the current settings state.
   */
  function getSettings() {
    return store.getState().settings;
  }

  function setPreferredPageSize(size: PageSize) {
    updateSettings({
      editor: {
        preferredPageSize: size,
      },
    });
  }

  function updateAccentColor(color: string) {
    updateSettingsDebounced({ appearance: { accentColor: color } });
  }

  return {
    updateSettings,
    updateSettingsDebounced,
    getSettings,
    setPreferredPageSize,
    updateAccentColor,
  };
};

export function useSettingsActions() {
  const store = useAppStore();
  const actions = useMemo(() => getSettingsActions(store), [store]);
  return actions;
}
