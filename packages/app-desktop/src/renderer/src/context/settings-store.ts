import { DEFAULT_USER_SETTINGS, UserSettings } from "@darkwrite/common";
import { create } from "zustand";
import { produce } from "immer";

type SettingsAction = {
  overwrite: (data: UserSettings) => void;
  setSidebarCollapsed: (val: boolean) => void;
};

export const useSettingsStore = create<UserSettings & SettingsAction>()(
  (set, get) => ({
    ...DEFAULT_USER_SETTINGS,
    overwrite: (data) => set(() => ({ ...data })),
    setSidebarCollapsed: (val) =>
      set(
        produce((state: UserSettings) => {
          state.state.sidebarCollapsed = val;
        }),
      ),
    save: async () => {
      await window.api.settings.save(get());
    },
  }),
);
