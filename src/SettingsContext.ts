import React from "react";
import { GlobalSettings } from "./Settings";
import { ISettingsContext } from "./ISettingsContext";


export const SettingsContext = React.createContext<ISettingsContext>({ settings: GlobalSettings.GetDefault(), updateSettings: () => { return; } });
