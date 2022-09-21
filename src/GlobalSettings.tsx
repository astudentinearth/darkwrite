import { Theme } from "./Theme";
import { readTextFile,writeTextFile } from "@tauri-apps/api/fs";
import { appDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api";
let settings_json:any;
let APPDIR:string;
const DefaultSettings:string=`
{
    "version":"1",
    "theme":"dark",
    "lightSchemeFile":"colors_light.json",
    "darkSchemeFile":"colors_dark.json",
    "font":"Roboto"
}
`;

async function LoadSettings(){
    console.log("[INFO] Loading settings");
    APPDIR=await appDir();
    console.log("[INFO] Checking if app data directory exists...");
    if (await invoke("path_exists",{targetPath: APPDIR})===false){ //to be migrated to tauri fs:exists
        console.log("[WARNING] App directory doesn't exist. Creating it.");
        invoke ("createDir",{ dir: APPDIR});
    }
    console.log("[INFO] Checking for settings file")
    let settingsExists = await invoke("path_exists",{targetPath:APPDIR+"settings.json"});
    if (settingsExists===false){
        console.log("[WARNING] Settings file not found. Creating default settings file");
        await writeTextFile(await appDir()+"settings.json",DefaultSettings);
    }
    
    let settings_string:string = await readTextFile(await appDir()+"settings.json");
    console.log(settings_string)
    //TODO: Handle broken config files
    if(settings_string.trim()==="" || settings_string === null || settings_string === undefined){
        console.log("here1")
        console.error("[ERROR] Something went wrong, and we couldn't load the settings. We can't proceed further.");
        return;
    }
    console.log("here 2")
    settings_json=JSON.parse(settings_string);
    console.log("here 3")
    switch (settings_json.theme){
        case "dark":
            GlobalSettings.ThemeMode=Theme.Dark;
            break;
        case "light":
            GlobalSettings.ThemeMode=Theme.Light;
            break;
        default:
            GlobalSettings.ThemeMode=Theme.Light;
            break;
    }
    GlobalSettings.LightSchemeFile=settings_json.lightSchemeFile;
    GlobalSettings.DarkSchemeFile=settings_json.darkSchemeFile;
    GlobalSettings.Font=settings_json.font;
    console.log("[INFO] LoadSettings() finished.")
}

class GlobalSettings{
    public static ThemeMode:Theme;
    public static DarkThemeStart:string;
    public static DarkThemeEnd:string;
    public static LightSchemeFile:string;
    public static DarkSchemeFile:string;
    public static Font:string;
    public static Version:string="1.0d";
}

function SaveAllSettings(){
    console.log("[INFO] Saving all settings.");
    settings_json.version=GlobalSettings.Version;
    settings_json.font=GlobalSettings.Font;
    switch(GlobalSettings.ThemeMode){
        case Theme.Light:
            settings_json.theme="light";
            break;
        
        case Theme.Dark:
            settings_json.theme="dark";
            break;
    }
    settings_json.darkSchemeFile=GlobalSettings.DarkSchemeFile;
    settings_json.lightSchemeFile=GlobalSettings.LightSchemeFile;
    let settings_string = JSON.stringify(settings_json);
    writeTextFile(APPDIR+"settings.json",settings_string).then(()=>{
        console.log("[INFO] Settings saved. Reloading settings")
        LoadSettings();
    });
}

export {LoadSettings, GlobalSettings,SaveAllSettings,APPDIR};