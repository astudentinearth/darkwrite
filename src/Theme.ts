import { BaseDirectory, createDir, exists, readTextFile, removeFile, writeFile } from "@tauri-apps/api/fs";
import { appConfigDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { ISettingsContext } from "./context/ISettingsContext";
import LightTheme from "./res/themes/colors_light.json?raw";
import DarkTheme from "./res/themes/colors_dark.json?raw";
import Blackout from "./res/themes/blackout.json?raw";

/**
     * Returns HEX color code from given 3 RGB channels
     * @param rgb: Red, green and blue channels separated with whitespaces
     */
function RGBToHex(rgb:string){
    const channels = rgb.split(' ');
    if(channels.length!==3){
        console.error("Can't convert RGB to hexadecimal. Invalid number of channels.");
    }
    const r = Number(channels[0]).toString(16);
    const g = Number(channels[1]).toString(16);
    const b = Number(channels[2]).toString(16);
    return "#"+r+g+b;
}

function HexToRGB(hex:string){
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1],16),
        g: parseInt(result[2],16),
        b: parseInt(result[3],16)
    } : null;
}

class Themes{
    public static CurrentTheme:string; // current theme file name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static CurrentThemeJSON:any; // json of current theme
}
// reads the theme files and creates theme objects 
async function SetupThemes(settingsContext:ISettingsContext){
    console.log("[INFO] Setting themes up");
    const {settings} = settingsContext;
    // apply fallback themes if the files are not there
   
    console.log("[INFO] Checking for color schemes directory");
    
    if (await exists("color-schemes/",{dir: BaseDirectory.App})===false){
        console.log("[WARNING] Color schemes directory doesn't exist. Creating it and copying default themes.");
        await createDir("color-schemes",{dir: BaseDirectory.App});
    }
    await writeFile("color-schemes/colors_light.json",LightTheme,{dir: BaseDirectory.App});
    await writeFile("color-schemes/colors_dark.json",DarkTheme,{dir: BaseDirectory.App});
    await writeFile("color-schemes/blackout.json",Blackout,{dir: BaseDirectory.App});
    const text = await readTextFile("color-schemes/"+settings.ThemeFile,{dir: BaseDirectory.App});
    const json = JSON.parse(text);
    if (json) Themes.CurrentThemeJSON = json;
    console.log("[INFO] Applying theme preferences");
    ApplyTheme(settings.ThemeFile,settingsContext);
}


// Applies a theme
// TODO: Separate the inner part to a separate function: duplicate code. Give the JSON object to the new function to apply it.
function ApplyTheme(themeFileName:string, context:ISettingsContext){
    const {settings} = context;
    console.log("[INFO from ApplyTheme()] Applying theme");
    document.documentElement.style.setProperty("--font",settings.Font);
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
    document.documentElement.style.setProperty("--widget",Themes.CurrentThemeJSON["widget"]||"73 73 73")
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
    const bgimg = document.querySelector<HTMLImageElement>("#bgImage");
    if(bgimg==null) return;
    if(await exists("wallpaper.png",{dir: BaseDirectory.App})) ext="png";
    if(await exists("wallpaper.jpg",{dir: BaseDirectory.App})) ext="jpg";
    if(await exists("wallpaper.jpeg",{dir: BaseDirectory.App})) ext="jpeg";
    if(ext==""){
        bgimg.style.setProperty("display","none");
        return;
    }
    const filePath = await join(await appConfigDir(), "wallpaper."+ext);
    const assetURL = convertFileSrc(filePath);

    //let bin = await readTextFile("wallpaper.base64",{dir: BaseDirectory.App});
   
    bgimg.src = assetURL+"?t="+Date.now().toString();
    bgimg.style.setProperty("display","");
    //bgimg.style.setProperty("background-image",`url("${bin}")`);
}

export async function DeleteWallpaper(){
    const bgimg = document.querySelector<HTMLImageElement>("#bgImage");
    if(bgimg==null) return;
    bgimg.style.setProperty("display","none");
    let ext = "";
    if(await exists("wallpaper.png",{dir: BaseDirectory.App})) ext="png";
    if(await exists("wallpaper.jpg",{dir: BaseDirectory.App})) ext="jpg";
    if(await exists("wallpaper.jpeg",{dir: BaseDirectory.App})) ext="jpeg";
    if(ext=="") return;
    await removeFile("wallpaper."+ext,{dir: BaseDirectory.App});
}

export { Themes, SetupThemes, ApplyWallpaper, ApplyTheme, /*SwitchTheme,*/ HexToRGB, RGBToHex };
