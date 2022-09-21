import { invoke } from "@tauri-apps/api";
import { createDir,readTextFile, writeFile } from "@tauri-apps/api/fs";
import React from "react";
import {appDir, homeDir} from "../node_modules/@tauri-apps/api/path"
import { GlobalSettings } from "./GlobalSettings";
let HOME:string;
let APPDIR:string; // this has a slash in the end!
const LightTheme_Fallback=`{
    "name":"Darkwrite Light",
    "background": "#ffffff",
    "foreground": "#000000",
    "shadow": "rgba(0,0,0,0.2)"
}
`;
const DarkTheme_Fallback=`{
    "name":"Darkwrite",
    "background": "#393939",
    "foreground": "#ffffff",
    "shadow": "rgba(0,0,0,0.2)"
}`;
const PastelPink=`
    {"name":"Pastel Pink",
    "background":"#cfa0d9",
    "foreground":"#ffffff",
    "shadow":"rgba(0,0,0,0.1)"}
`
const BlackoutNeonBlue=`
    {"name":"Blackout Neon Blue",
    "background":"#0d0d0d",
    "foreground":"#ffffff",
    "shadow":"rgba(29, 52, 153, 0.3)"}
`
const BlackoutNeonGreen=`
    {"name":"Blackout Neon Green",
    "background":"#0d0d0d",
    "foreground":"#ffffff",
    "shadow":"rgba(15, 148, 28, 0.3)"}
`
const Sky=`
    {"name":"Sky",
    "background":"#a5c9c8",
    "foreground":"#000000",
    "shadow":"rgba(0,0,0,0.1)"}
`
const GreenOnBlack=`
    {"name":"Green on Black",
    "background":"#000000",
    "foreground":"#11ff11",
    "shadow":"transparent",
    "border":"2px solid #00ff00"}
`
const BlueOnBlack=`
    {"name":"Blue on Black",
    "background":"#000000",
    "foreground":"#1111ff",
    "shadow":"transparent",
    "border":"2px solid #0000ff"}
`
const WhiteOnBlack=`
    {"name":"White on Black",
    "background":"#000000",
    "foreground":"#ffffff",
    "shadow":"transparent",
    "border":"2px solid #ffffff"}
`
const RedOnBlack=`
    {"name":"Red on Black",
    "background":"#000000",
    "foreground":"#ff1111",
    "shadow":"transparent",
    "border":"2px solid #ff0000"}
`
class Themes{
    public static LightTheme: string; // stringified json of the light theme
    public static LightThemeJSON: any; // json of the light theme
    public static DarkTheme:string; // stringified json of the dark theme
    public static DarkThemeJSON:any; // json of the dark theme
    public static CurrentTheme:Theme; // current theme as enum
    public static CurrentThemeJSON:any; // json of current theme
}
// reads the theme files and creates theme objects 
async function SetupThemes(){
    console.log("[INFO] Setting themes up");
    APPDIR=await appDir();
    HOME=await homeDir();
    // apply fallback themes if the files are not there
   
    console.log("[INFO] Checking for color schemes directory");
    
    if (await invoke("path_exists",{targetPath:APPDIR+"color-schemes/"})==false){
        console.log("[WARNING] Color schemes directory doesn't exist. Creating it and copying default themes.");
        await createDir(APPDIR+"color-schemes");
        await writeFile(APPDIR+"color-schemes/colors_light.json",LightTheme_Fallback);
        await writeFile(APPDIR+"color-schemes/colors_dark.json",DarkTheme_Fallback);
        await writeFile(APPDIR+"color-schemes/blackout_neon_green.json",BlackoutNeonGreen);
        await writeFile(APPDIR+"color-schemes/blackout_neon_blue.json",BlackoutNeonBlue);
        await writeFile(APPDIR+"color-schemes/sky.json",Sky);
        await writeFile(APPDIR+"color-schemes/pastel_pink.json",PastelPink);
    }
    Themes.LightTheme=await readTextFile(APPDIR+"color-schemes/"+GlobalSettings.LightSchemeFile);
    Themes.DarkTheme=await readTextFile(APPDIR+"color-schemes/"+GlobalSettings.DarkSchemeFile);
    Themes.LightThemeJSON=JSON.parse(Themes.LightTheme);
    Themes.DarkThemeJSON=JSON.parse(Themes.DarkTheme);
    
    switch(GlobalSettings.ThemeMode){
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
    ApplyTheme(GlobalSettings.ThemeMode);
}


// Applies a theme
// TODO: Separate the inner part to a separate function: duplicate code. Give the JSON object to the new function to apply it.
function ApplyTheme(theme:Theme){
    console.log("[INFO from ApplyTheme()] Applying theme");
    document.documentElement.style.setProperty("--font",GlobalSettings.Font);
    switch(theme){
        case Theme.Dark:
            console.log("[INFO from ApplyTheme] Setting up dark theme");
            document.documentElement.style.setProperty("--background-default",String(Themes.DarkThemeJSON["background"]));
            document.documentElement.style.setProperty("--text-default",String(Themes.DarkThemeJSON["foreground"]));
            document.documentElement.style.setProperty("--shadow",String(Themes.DarkThemeJSON["shadow"]));
            Themes.CurrentTheme=Theme.Dark;
            if(Themes.DarkThemeJSON.border){
                document.documentElement.style.setProperty("--border",Themes.DarkThemeJSON["border"])
            }
            else{
                console.log("[WARNING from ApplyTheme] Selected theme doesn't make use of the 'border' property. No border will be used.");
                document.documentElement.style.setProperty("--border","none");
            }
            break;
        case Theme.Light:
            console.log("[INFO from ApplyTheme] Setting up light theme");
            document.documentElement.style.setProperty("--background-default",String(Themes.LightThemeJSON["background"]));
            document.documentElement.style.setProperty("--text-default",String(Themes.LightThemeJSON["foreground"]));
            document.documentElement.style.setProperty("--shadow",String(Themes.LightThemeJSON["shadow"]));
            Themes.CurrentTheme=Theme.Light;
            if(Themes.LightThemeJSON.border){
                document.documentElement.style.setProperty("--border",Themes.LightThemeJSON["border"])
            }
            else{
                console.log("[WARNING from ApplyTheme] Selected theme doesn't make use of the 'border' property. No border will be used.");
                document.documentElement.style.setProperty("--border","none");
            }
            break;
        default:
            console.log("[WARNING from ApplyTheme()] Default case triggered. Falling back to light theme.");
            ApplyTheme(Theme.Light);
            break;
    }
}

// Switches the theme
function SwitchTheme(){
    if (Themes.CurrentTheme==Theme.Dark){
        ApplyTheme(Theme.Light)
    }
    else{
        ApplyTheme(Theme.Dark)
    }
}

enum Theme{
    Light=0,
    Dark=1,
}
export {Themes,Theme,SetupThemes,ApplyTheme,SwitchTheme,APPDIR};