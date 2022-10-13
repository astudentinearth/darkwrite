import { SetupThemes, Theme } from "./Theme";
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
    "font":"Roboto",
    "accentColor":"87 104 225",
    "sansFont":"Roboto",
    "serifFont":"Roboto Slab",
    "monoFont":"Roboto Mono",
    "handFont":"Yellowtail"
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
    settings_json=JSON.parse(settings_string);
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
    console.table(settings_json)
    GlobalSettings.LightSchemeFile=settings_json.lightSchemeFile ?? "colors_light.json";
    GlobalSettings.DarkSchemeFile=settings_json.darkSchemeFile ?? "colors_dark.json";
    GlobalSettings.Font=settings_json.font ?? "Roboto";
    GlobalSettings.SansFont=settings_json.sansFont ?? "Roboto";
    GlobalSettings.SerifFont=settings_json.serifFont ?? "Roboto Slab";
    GlobalSettings.HandwritingFont=settings_json.handFont ?? "Yellowtail";
    GlobalSettings.MonospaceFont=settings_json.monoFont ?? "Roboto Mono";
    GlobalSettings.AccentColor=settings_json.accentColor ?? "87 104 255";
    
    console.log("[INFO] LoadSettings() finished.")
}

class GlobalSettings{
    public static ThemeMode:Theme;
    public static LightSchemeFile:string;
    public static DarkSchemeFile:string;
    public static Font:string;
    public static Version:string="1.0d";
    public static AccentColor:string="87 104 255";
    public static SansFont:string="Roboto";
    public static SerifFont:string="Roboto Slab";
    public static HandwritingFont:string="Yellowtail";
    public static MonospaceFont:string="Roboto Mono";
}

function SaveAllSettings(){
    console.log("[INFO] Saving all settings.");
    let newJSON={"version":GlobalSettings.Version,
    "theme":GlobalSettings.ThemeMode===Theme.Dark ? "dark" : "light",
    "lightSchemeFile":GlobalSettings.LightSchemeFile ?? "colors_light.json",
    "darkSchemeFile":GlobalSettings.DarkSchemeFile ?? "colors_dark.json",
    "font":GlobalSettings.Font ?? "Roboto",
    "accentColor":GlobalSettings.AccentColor,
    "sansFont":GlobalSettings.SansFont ?? "Roboto",
    "serifFont":GlobalSettings.SerifFont ?? "Roboto Slab",
    "monoFont":GlobalSettings.MonospaceFont ?? "Roboto Mono",
    "handFont":GlobalSettings.HandwritingFont ?? "Yellowtail"};
    let settings_string = JSON.stringify(newJSON);
    writeTextFile(APPDIR+"settings.json",settings_string).then(()=>{
        console.log("[INFO] Settings saved. Reloading settings")
        LoadSettings().then(()=>SetupThemes());
    });
}

export {LoadSettings, GlobalSettings,SaveAllSettings,APPDIR};