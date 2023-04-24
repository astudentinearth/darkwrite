import { invoke } from "@tauri-apps/api";
import { BaseDirectory, createDir,exists,readBinaryFile,readTextFile, removeFile, writeFile } from "@tauri-apps/api/fs";
import { GlobalSettings, ISettingsContext, SettingsContext } from "./GlobalSettings";
import { Uint8ArrayToBase64 } from "./Util";
import { appConfigDir, join } from "@tauri-apps/api/path";
import {convertFileSrc} from "@tauri-apps/api/tauri";

const LightTheme=`{
    "name":"Darkwrite Light",
    "background": "241 241 241",
    "foreground": "#000000", 
    "background-secondary":"255 255 255",
    "background-hover":"231 231 231",
    "background-active":"223 223 223",
    "shadow": "rgba(40,40,40,0.3)",
    "text-disabled": "153 153 153",
    "background-disabled":"204 204 204"
}
`;
const DarkTheme=`{
    "name":"Darkwrite",
    "background": "57 57 57",
    "foreground": "#ffffff",
    "background-secondary":"73 73 73",
    "background-hover":"86 86 86",
    "background-active":"96 96 96",
    "shadow": "rgba(0,0,0,0.2)",
    "text-disabled": "170 170 170",
    "background-disabled": "89 89 89"
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
    public static CurrentTheme:string; // current theme file name
    public static CurrentThemeJSON:any; // json of current theme
}
// reads the theme files and creates theme objects 
async function SetupThemes(settingsContext:ISettingsContext){
    console.log("[INFO] Setting themes up");
    const {settings,updateSettings} = settingsContext;
    // apply fallback themes if the files are not there
   
    console.log("[INFO] Checking for color schemes directory");
    
    if (await exists("color-schemes/",{dir: BaseDirectory.App})===false){
        console.log("[WARNING] Color schemes directory doesn't exist. Creating it and copying default themes.");
        await createDir("color-schemes",{dir: BaseDirectory.App});
    }
    await writeFile("color-schemes/colors_light.json",LightTheme,{dir: BaseDirectory.App});
    await writeFile("color-schemes/colors_dark.json",DarkTheme,{dir: BaseDirectory.App});
    let text = await readTextFile("color-schemes/"+settings.ThemeFile,{dir: BaseDirectory.App});
    let json = JSON.parse(text);
    if (json) Themes.CurrentThemeJSON = json;
    console.log("[INFO] Applying theme preferences");
    ApplyTheme(settings.ThemeFile,settingsContext);
}


// Applies a theme
// TODO: Separate the inner part to a separate function: duplicate code. Give the JSON object to the new function to apply it.
function ApplyTheme(themeFileName:string, context:ISettingsContext){
    const {settings,updateSettings} = context;
    console.log("[INFO from ApplyTheme()] Applying theme");
    document.documentElement.style.setProperty("--font",settings.Font);
    document.documentElement.style.setProperty("--font-sans",settings.SansFont);
    document.documentElement.style.setProperty("--font-serif",settings.SerifFont);
    document.documentElement.style.setProperty("--font-hand",settings.HandwritingFont);
    document.documentElement.style.setProperty("--font-mono",settings.MonospaceFont);
    document.documentElement.style.setProperty("--accent",settings.AccentColor);
    console.log("[INFO from ApplyTheme()] Setting up dark theme");
    document.documentElement.style.setProperty("--background-default",Themes.CurrentThemeJSON["background"]||"57 57 57");
    document.documentElement.style.setProperty("--text-default",Themes.CurrentThemeJSON["foreground"] || "#FFFFFF");
    document.documentElement.style.setProperty("--shadow",Themes.CurrentThemeJSON["shadow"] || "rgba(0,0,0,0.2)");
    document.documentElement.style.setProperty("--border",Themes.CurrentThemeJSON["border"]||"none")
    document.documentElement.style.setProperty("--background-secondary",Themes.CurrentThemeJSON["background-secondary"]||"73 73 73")
    document.documentElement.style.setProperty("--background-hover",Themes.CurrentThemeJSON["background-hover"]||"86 86 86")
    document.documentElement.style.setProperty("--background-active",Themes.CurrentThemeJSON["background-active"]||"96 96 96")
    document.documentElement.style.setProperty("--background-disabled",Themes.CurrentThemeJSON["background-disabled"]||"89 89 89")
    document.documentElement.style.setProperty("--text-disabled",Themes.CurrentThemeJSON["text-disabled"]||"170 170 170")
    Themes.CurrentTheme=themeFileName;
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
    let ext = "";
    let bgimg:any = document.querySelector("#bgImage");
    if(await exists("wallpaper.png",{dir: BaseDirectory.App})) ext="png";
    if(await exists("wallpaper.jpg",{dir: BaseDirectory.App})) ext="jpg";
    if(await exists("wallpaper.jpeg",{dir: BaseDirectory.App})) ext="jpeg";
    if(ext==""){
        bgimg.style.setProperty("display","none");
        return;
    }
    let filePath = await join(await appConfigDir(), "wallpaper."+ext);
    let assetURL = convertFileSrc(filePath);

    //let bin = await readTextFile("wallpaper.base64",{dir: BaseDirectory.App});
   
    bgimg.src = assetURL+"?t="+Date.now().toString();
    bgimg.style.setProperty("display","");
    //bgimg.style.setProperty("background-image",`url("${bin}")`);
}

export async function DeleteWallpaper(){
    let bgimg:any = document.querySelector("#bgImage");
    bgimg.style.setProperty("display","none");
    let ext = "";
    if(await exists("wallpaper.png",{dir: BaseDirectory.App})) ext="png";
    if(await exists("wallpaper.jpg",{dir: BaseDirectory.App})) ext="jpg";
    if(await exists("wallpaper.jpeg",{dir: BaseDirectory.App})) ext="jpeg";
    if(ext=="") return;
    await removeFile("wallpaper."+ext,{dir: BaseDirectory.App});
}

export {Themes,SetupThemes,ApplyWallpaper,ApplyTheme,/*SwitchTheme,*/HexToRGB,RGBToHex};