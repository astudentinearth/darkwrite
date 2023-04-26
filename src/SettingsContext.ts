import { Dispatch, SetStateAction } from "react";
import { GlobalSettings } from "./Settings";


export interface ISettingsContext {
    settings: GlobalSettings;
    updateSettings: Dispatch<SetStateAction<GlobalSettings>>;
}
