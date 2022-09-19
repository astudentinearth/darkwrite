import { SetupThemes, Theme } from "./Theme";
import { readTextFile,writeTextFile } from "@tauri-apps/api/fs";
import { appDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api";
import {LoadTasks} from "./UI/Tasks";
let settings_json:any;
let APPDIR:string;
const DefaultSettings:string=`
{
    "version":"1",
    "theme":"dark",
    "darkThemeStart":"18:00",
    "darkThemeEnd":"06:00",
    "lightSchemeFile":"colors_light.json",
    "darkSchemeFile":"colors_dark.json",
    "font":"Roboto",
}
`;

async function LoadSettings(){
    APPDIR=await appDir();
    console.log("Checking if app data directory exists...");
    if (await invoke("path_exists",{targetPath: APPDIR})==false){
        console.log("App directory doesn't exist. Creating it.");
        invoke ("createDir",{ dir: APPDIR});
    }
    let settingsExists = await invoke("path_exists",{targetPath:await appDir()+"settings.json"});
    if (settingsExists==false){
        console.log("Settings file not found. Generating...");
        await writeTextFile(await appDir()+"settings.json",DefaultSettings);
    }
    let settings_string:string = await readTextFile(await appDir()+"settings.json");
    settings_json=JSON.parse(settings_string);
    switch (settings_json.theme){
        case "dark":
            GlobalSettings.ThemeMode=Theme.Dark;
            break;
        case "light":
            GlobalSettings.ThemeMode=Theme.Light;
            break;
        case "dynamic":
            GlobalSettings.ThemeMode=Theme.Dynamic;
            break;
        default:
            GlobalSettings.ThemeMode=Theme.Light;
            break;
    }
    GlobalSettings.DarkThemeStart=settings_json.darkThemeStart;
    GlobalSettings.DarkThemeEnd=settings_json.darkThemeEnd;
    GlobalSettings.LightSchemeFile=settings_json.lightSchemeFile;
    GlobalSettings.DarkSchemeFile=settings_json.darkSchemeFile;
    GlobalSettings.Font=settings_json.font;
    await SetupThemes();
    await LoadTasks();
}

class GlobalSettings{
    public static ThemeMode:Theme;
    public static DarkThemeStart:string;
    public static DarkThemeEnd:string;
    public static LightSchemeFile:string;
    public static DarkSchemeFile:string;
    public static Font:string;
    public static Version:string="1.0b1";
}

function SaveAllSettings(){
    settings_json.version="1";
    settings_json.font=GlobalSettings.Font;
    switch(GlobalSettings.ThemeMode){
        case Theme.Light:
            settings_json.theme="light";
            break;
        
        case Theme.Dark:
            settings_json.theme="dark";
            break;
        
        case Theme.Dynamic:
            settings_json.theme="dynamic";
            break;
    }
    
    settings_json.darkThemeStart=GlobalSettings.DarkThemeStart;
    settings_json.darkThemeEnd=GlobalSettings.DarkThemeEnd;
    settings_json.darkSchemeFile=GlobalSettings.DarkSchemeFile;
    settings_json.lightSchemeFile=GlobalSettings.LightSchemeFile;
    let settings_string = JSON.stringify(settings_json);
    writeTextFile(APPDIR+"settings.json",settings_string).then(()=>{
        LoadSettings();
    });
}

export {LoadSettings, GlobalSettings,SaveAllSettings,APPDIR};