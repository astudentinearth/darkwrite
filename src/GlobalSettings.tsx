import { SetupThemes } from "./Theme";
import { BaseDirectory, exists, readTextFile,writeTextFile } from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api";
import { DefaultSettings } from "./Util";
import React, { Dispatch, SetStateAction, useContext } from "react";
let settings_json:any;

async function LoadSettings(){
    let _settings:GlobalSettings = new GlobalSettings();
    console.log("[INFO] Checking for settings file")
    let settingsExists = await exists("settings.json",{dir:BaseDirectory.App});
    if (settingsExists===false){
        console.log("[WARNING] Settings file not found. Creating default settings file");
        await writeTextFile("settings.json",DefaultSettings,{dir:BaseDirectory.App});
    }
    
    let settings_string:string = await readTextFile(await appConfigDir()+"settings.json");
    console.log(settings_string)
    //TODO: Handle broken config files
    if(settings_string.trim()==="" || settings_string === null || settings_string === undefined){
        console.error("[ERROR] Something went wrong, and we couldn't load the settings. We can't proceed further.");
        return GlobalSettings.GetDefault();
    }
    settings_json=JSON.parse(settings_string);
    if(settings_json==null){
        console.error("Settings JSON object is null/undefined. Configuration may have a syntax error. Falling back to default settings.");
        settings_string=DefaultSettings;
        settings_json=JSON.parse(DefaultSettings);
    }
    _settings.Font=settings_json.font ?? "Roboto";
    _settings.SansFont=settings_json.sansFont ?? "Roboto";
    _settings.SerifFont=settings_json.serifFont ?? "Roboto Slab";
    _settings.HandwritingFont=settings_json.handFont ?? "Yellowtail";
    _settings.MonospaceFont=settings_json.monoFont ?? "Roboto Mono";
    _settings.AccentColor=settings_json.accentColor ?? "87 104 255";
    _settings.DisableBlur=settings_json.disableBlur ?? false;
    _settings.ThemeFile = settings_json.themeFile ?? "colors_dark.json";
    return _settings;
}

class GlobalSettings{
    public ThemeFile:string="colors_dark.json";
    public Font:string="Roboto";
    public Version:string="1.0d";
    public AccentColor:string="87 104 255";
    public SansFont:string="Roboto";
    public SerifFont:string="Roboto Slab";
    public HandwritingFont:string="Yellowtail";
    public MonospaceFont:string="Roboto Mono";
    public DisableBlur:boolean=false;
    public static GetDefault(){
        return new GlobalSettings();
    }
}

export interface ISettingsContext{
    settings: GlobalSettings,
    updateSettings: Dispatch<SetStateAction<GlobalSettings>>;
}

export const SettingsContext = React.createContext<ISettingsContext>({settings:GlobalSettings.GetDefault(),updateSettings:()=>{}});

function SaveAllSettings(context:ISettingsContext){
    console.log("[INFO] Saving all settings.");
    const {settings} = context;
    let newJSON={"version":settings.Version,
    "themeFile":settings.ThemeFile ?? "colors_dark.json",
    "font":settings.Font ?? "Roboto",
    "accentColor":settings.AccentColor,
    "sansFont":settings.SansFont ?? "Roboto",
    "serifFont":settings.SerifFont ?? "Roboto Slab",
    "monoFont":settings.MonospaceFont ?? "Roboto Mono",
    "handFont":settings.HandwritingFont ?? "Yellowtail"};
    let settings_string = JSON.stringify(newJSON);
    writeTextFile("settings.json",settings_string,{dir:BaseDirectory.App}).then(()=>{
        console.log("[INFO] Settings saved. Reloading settings")
        LoadSettings().then(()=>SetupThemes(context));
    });
}

export {LoadSettings, GlobalSettings,SaveAllSettings};
