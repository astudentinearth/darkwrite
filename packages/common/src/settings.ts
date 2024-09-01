
export interface UserSettings{
    state: {
        sidebarWidth: number,
        sidebarCollapsed: boolean,
        route: string
    },
    lang: string,
    appearance: {
        theme: string,
    },
    fonts: {
        sans: string,
        serif: string,
        code: string,
        ui: string
    }
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
    state: {
        sidebarWidth: 240,
        sidebarCollapsed: false,
        route: "/"
    },
    lang: "en",
    appearance: {
        theme: "darkwrite.json"
    },
    // terrible selection - to be changed
    fonts: {
        sans: "Arial",
        serif: "Times New Roman",
        code: "Courier New",
        ui: "Segoe UI"
    }
}

export function buildUserSettings(data: Partial<UserSettings> = {}){
    return {...DEFAULT_USER_SETTINGS, ...data} as UserSettings;
}