import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { GlobalSettings } from "./Settings";
import { ISettingsContext } from "./data/ISettingsContext";
import { SetupThemes } from "./Theme";
import { DefaultSettings } from "./Util";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let settings_json:any;

async function LoadSettings(){
    console.log("[INFO] Checking for settings file")
    const settingsExists = await exists("settings.json",{dir:BaseDirectory.App});
    if (settingsExists===false){
        console.warn("[WARNING] Settings file not found. Creating default settings file");
        await writeTextFile("settings.json",DefaultSettings,{dir:BaseDirectory.App});
    }
    
    let settings_string:string = await readTextFile(await appConfigDir()+"settings.json");
    console.log(settings_string)
    //TODO: Handle broken config files
    if(settings_string.trim()=="" || settings_string == null){
        console.error("[ERROR] Something went wrong, and we couldn't load the settings. We can't proceed further.");
        return GlobalSettings.GetDefault();
    }
    settings_json=JSON.parse(settings_string);
    if(settings_json==null){
        console.error("Settings JSON object is null/undefined. Configuration may have a syntax error. Falling back to default settings.");
        settings_string=DefaultSettings;
        settings_json=JSON.parse(DefaultSettings);
    }
    console.warn(settings_json.font);
    return GlobalSettings.fromJSON(settings_json);
}

function SaveAllSettings(context:ISettingsContext){
    console.warn("[INFO] Saving all settings.");
    const {settings} = context;
    const newJSON = GlobalSettings.toJSON(settings);
    const settings_string = JSON.stringify(newJSON);
    writeTextFile("settings.json",settings_string,{dir:BaseDirectory.App}).then(()=>{
        console.log("[INFO] Settings saved. Reloading settings")
        LoadSettings().then(()=>SetupThemes(context));
    });
}

export { LoadSettings, GlobalSettings, SaveAllSettings };

