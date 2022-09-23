import React from "react";
import { GlobalSettings, SaveAllSettings } from "../../GlobalSettings";
import { Theme,ApplyTheme, SetupThemes } from "../../Theme";

function setLightTheme(){
    console.log("[INFO] Theme preference has been changed to light theme.");
    GlobalSettings.ThemeMode=Theme.Light;
    SaveAllSettings();
    SetupThemes().then(()=>{ApplyTheme(Theme.Light);});
}

function setDarkTheme(){
    console.log("[INFO] Theme preference has been changed to dark theme.");
    GlobalSettings.ThemeMode=Theme.Dark;
    SaveAllSettings();
    SetupThemes().then(()=>{ApplyTheme(Theme.Dark);});
    
}


function ThemeApplet(){
    return <div className=" background-secondary p-4 my-4 rounded-2xl border-default shadow-default">
        <span className="text-2xl m-4 font-bold block text-default">Theme</span>
        <div className="inline-block p-2">
            <div className="float-left text-center m-4">
                <div onClick={setLightTheme} className="w-40 bg-white  shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-black text-3xl bi-brightness-high-fill"></i></div>
                <span className="text-default m-2 text-center">Light</span>
            </div>
            <div className="float-left text-center m-4">
                <div onClick={setDarkTheme} className="w-40 bg-black shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-white text-3xl bi-moon"></i></div>
                <span className="text-default m-2 text-center">Dark</span>
            </div>
        </div>
        <div>
            <span className="p-4">Light color scheme: </span>
            <select id="lightColorScheme" onChange={SaveColorSchemes} className="dropdown">
                <option>Darkwrite</option>
                <option>Darkwrite Light</option>
            </select>
        </div>
        <br></br>
        <div>
            <span className="p-4">Dark color scheme: </span>
            <select id="darkColorScheme" onChange={SaveColorSchemes} className="dropdown">
                <option>Darkwrite</option>
                <option>Darkwrite Light</option>
            </select>
        </div><br></br>
        <span className="p-4">Font (press enter to save): </span><input id="fontBox" className="rounded-xl background-secondary text-default" tabIndex={0}  type="text" onKeyDown={handleFont} defaultValue="Roboto"></input>
    </div>
}
function handleFont(e:any){
    
    if(e.keyCode==13){
        let fontbox:any = document.getElementById("fontBox");
        GlobalSettings.Font=fontbox.value;
        console.log(`[INFO] User has changed their font to ${fontbox.value}`);
        SaveAllSettings();
    }
}

function SaveColorSchemes(){
    let lightSchemeChooser:any=document.getElementById("lightColorScheme");
    let darkSchemeChooser:any=document.getElementById("darkColorScheme");
    GlobalSettings.DarkSchemeFile=darkSchemeChooser.value;
    GlobalSettings.LightSchemeFile=lightSchemeChooser.value;
    console.log("[INFO] Saving user color scheme preferences.");
    SaveAllSettings();
    SetupThemes().then(()=>{ApplyTheme(GlobalSettings.ThemeMode);});
}
export default ThemeApplet;