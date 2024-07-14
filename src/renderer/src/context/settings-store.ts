import { DEFAULT_USER_SETTINGS, UserSettings } from "@common/settings"
import { create } from "zustand"
import { produce } from "immer"

type SettingsAction = {
    overwrite: (data: UserSettings) => void,
    setSidebarCollapsed: (val: boolean) => void
}

export const useSettingsStore = create<UserSettings & SettingsAction>((set)=>({
    ...DEFAULT_USER_SETTINGS,
    overwrite: (data) => set(()=>({...data})),
    setSidebarCollapsed: (val) => set(produce((state: UserSettings)=>{state.state.sidebarCollapsed = val}))
}))

