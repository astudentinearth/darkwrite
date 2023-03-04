import { invoke } from "@tauri-apps/api";
import { BaseDirectory, createDir,exists,readBinaryFile,readTextFile, writeFile } from "@tauri-apps/api/fs";
import {appDir} from "../node_modules/@tauri-apps/api/path"
import { GlobalSettings, ISettingsContext, SettingsContext } from "./GlobalSettings";
import { Uint8ArrayToBase64 } from "./Util";

enum Theme{
    Light=0,
    Dark=1,
}
let APPDIR:string; // this has a slash in the end!
const LightTheme=`{
    "name":"Darkwrite Light",
    "background": "241 241 241",
    "foreground": "#000000", 
    "background-secondary":"255 255 255",
    "background-hover":"231 231 231",
    "background-active":"223 223 223",
    "shadow": "rgba(40,40,40,0.3)"
}
`;
const DarkTheme=`{
    "name":"Darkwrite",
    "background": "57 57 57",
    "foreground": "#ffffff",
    "background-secondary":"73 73 73",
    "background-hover":"86 86 86",
    "background-active":"96 96 96",
    "shadow": "rgba(0,0,0,0.2)"
}`;
/**
     * Returns HEX color code from given 3 RGB channels
     * @param rgb: Red, green and blue channels separated with whitespaces
     */
function RGBToHex(rgb:string){
    let channels = rgb.split(' ');
    if(channels.length!==3){
        console.error("Can't convert RGB to hexadecimal. Invalid number of channels.");
    }
    let r = Number(channels[0]).toString(16);
    let g = Number(channels[1]).toString(16);
    let b = Number(channels[2]).toString(16);
    return "#"+r+g+b;
}

function HexToRGB(hex:string){
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1],16),
        g: parseInt(result[2],16),
        b: parseInt(result[3],16)
    } : null;
}

class Themes{
    public static LightTheme: string; // stringified json of the light theme
    public static LightThemeJSON: any; // json of the light theme
    public static DarkTheme:string; // stringified json of the dark theme
    public static DarkThemeJSON:any; // json of the dark theme
    public static CurrentTheme:Theme; // current theme as enum
    public static CurrentThemeJSON:any; // json of current theme
}
// reads the theme files and creates theme objects 
async function SetupThemes(settingsContext:ISettingsContext){
    console.log("[INFO] Setting themes up");
    const {settings,updateSettings} = settingsContext;
    APPDIR=await appDir();
    // apply fallback themes if the files are not there
   
    console.log("[INFO] Checking for color schemes directory");
    
    if (await invoke("path_exists",{targetPath:APPDIR+"color-schemes/"})===false){
        console.log("[WARNING] Color schemes directory doesn't exist. Creating it and copying default themes.");
        await createDir(APPDIR+"color-schemes");
        await writeFile(APPDIR+"color-schemes/colors_light.json",LightTheme);
        await writeFile(APPDIR+"color-schemes/colors_dark.json",DarkTheme);
    }
    Themes.LightTheme=await readTextFile(APPDIR+"color-schemes/"+settings.LightSchemeFile);
    Themes.DarkTheme=await readTextFile(APPDIR+"color-schemes/"+settings.DarkSchemeFile);
    Themes.LightThemeJSON=JSON.parse(Themes.LightTheme);
    Themes.DarkThemeJSON=JSON.parse(Themes.DarkTheme);
    
    switch(settings.ThemeMode){
        case Theme.Dark:
            Themes.CurrentTheme=Theme.Dark;
            Themes.CurrentThemeJSON=Themes.DarkThemeJSON;    
            break;
        case Theme.Light:
            Themes.CurrentTheme=Theme.Light;
            Themes.CurrentThemeJSON=Themes.LightThemeJSON;    
            break;
        }
    console.log("[INFO] Applying theme preferences");
    ApplyTheme(settings.ThemeMode,settingsContext);
}


// Applies a theme
// TODO: Separate the inner part to a separate function: duplicate code. Give the JSON object to the new function to apply it.
function ApplyTheme(theme:Theme, context:ISettingsContext){
    const {settings,updateSettings} = context;
    console.log("[INFO from ApplyTheme()] Applying theme");
    document.documentElement.style.setProperty("--font",settings.Font);
    document.documentElement.style.setProperty("--font-sans",settings.SansFont);
    document.documentElement.style.setProperty("--font-serif",settings.SerifFont);
    document.documentElement.style.setProperty("--font-hand",settings.HandwritingFont);
    document.documentElement.style.setProperty("--font-mono",settings.MonospaceFont);
    document.documentElement.style.setProperty("--accent",settings.AccentColor);
    switch(theme){
        case Theme.Dark:
            console.log("[INFO from ApplyTheme] Setting up dark theme");
            document.documentElement.style.setProperty("--background-default",Themes.DarkThemeJSON["background"]||"#373737");
            document.documentElement.style.setProperty("--text-default",Themes.DarkThemeJSON["foreground"] || "#FFFFFF");
            document.documentElement.style.setProperty("--shadow",Themes.DarkThemeJSON["shadow"] || "rgba(0,0,0,0.2)");
            document.documentElement.style.setProperty("--border",Themes.DarkThemeJSON["border"]||"none")
            document.documentElement.style.setProperty("--background-secondary",Themes.DarkThemeJSON["background-secondary"]||(Themes.DarkThemeJSON["background"]||"#494949"))
            document.documentElement.style.setProperty("--background-hover",Themes.DarkThemeJSON["background-hover"]||(Themes.DarkThemeJSON["background"]||"#494949"))
            document.documentElement.style.setProperty("--background-active",Themes.DarkThemeJSON["background-active"]||(Themes.DarkThemeJSON["background"]||"#494949"))
            Themes.CurrentTheme=Theme.Dark;
            break;
        case Theme.Light:
            console.log("[INFO from ApplyTheme] Setting up light theme");
            document.documentElement.style.setProperty("--background-default",Themes.LightThemeJSON["background"]||"#373737");
            document.documentElement.style.setProperty("--text-default",Themes.LightThemeJSON["foreground"]||"#000000");
            document.documentElement.style.setProperty("--shadow",Themes.LightThemeJSON["shadow"]||"rgba(0,0,0,0.2)");
            document.documentElement.style.setProperty("--border",Themes.LightThemeJSON["border"]||"none")
            document.documentElement.style.setProperty("--background-secondary",Themes.LightThemeJSON["background-secondary"]||(Themes.LightThemeJSON["background"]||"#e5e5e5"))
            document.documentElement.style.setProperty("--background-hover",Themes.LightThemeJSON["background-hover"]||(Themes.LightThemeJSON["background"]||"#494949"))
            document.documentElement.style.setProperty("--background-active",Themes.LightThemeJSON["background-active"]||(Themes.LightThemeJSON["background"]||"#494949"))
            Themes.CurrentTheme=Theme.Light;
            break;
        default:
            console.log("[WARNING from ApplyTheme()] Default case triggered. Falling back to light theme.");
            ApplyTheme(Theme.Light,context);
            break;
    }
}

// Switches the theme
/*function SwitchTheme(){
    if (Themes.CurrentTheme===Theme.Dark){
        ApplyTheme(Theme.Light)
    }
    else{
        ApplyTheme(Theme.Dark)
    }
}*/

async function ApplyWallpaper(){
    if(!await exists("wallpaper.base64",{dir: BaseDirectory.App})) return;
    let bin = await readTextFile("wallpaper.base64",{dir: BaseDirectory.App});
    let bgimg:any = document.querySelector("#bgImage");
    bgimg.style.setProperty("background-image",`url("${bin}")`);
}



export {Themes,Theme,SetupThemes,ApplyWallpaper,ApplyTheme,/*SwitchTheme,*/APPDIR,HexToRGB,RGBToHex};