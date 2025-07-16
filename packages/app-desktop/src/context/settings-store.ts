import { DEFAULT_USER_SETTINGS, UserSettings } from "@darkwrite/common";
import { SettingsAPI } from "@/api";
import { produce, WritableDraft } from "immer";
import { debounce } from "lodash";
import { create } from "zustand";

type SettingsAction = {
  settings: UserSettings;
  initialized: boolean;
};

export const useSettingsStore = create<SettingsAction>()(() => ({
  settings: DEFAULT_USER_SETTINGS,
  initialized: false,
}));

const saveWithDebounce = debounce((data: UserSettings) => {
  SettingsAPI().save(data);
}, 300);

export function initializeUserSettings(data: UserSettings) {
  useSettingsStore.setState({ settings: data, initialized: true });
}

export function updateUserSettings(
  callback: (oldState: UserSettings) => UserSettings,
) {
  const newState = callback(useSettingsStore.getState().settings);
  useSettingsStore.setState({ settings: newState });
  saveWithDebounce(newState);
}

export function produceUserSettings(
  callback: (draft: WritableDraft<UserSettings>) => void,
) {
  const newState = produce(useSettingsStore.getState().settings, callback);
  useSettingsStore.setState({ settings: newState });
  saveWithDebounce(newState);
}
