import { invoke } from "@tauri-apps/api";
import { readTextFile } from "@tauri-apps/api/fs";
import React, { useState } from "react";
import { APPDIR, GlobalSettings, SaveAllSettings } from "../../GlobalSettings";
import { Theme,ApplyTheme, SetupThemes } from "../../Theme";
let LoadColorSchemes:any;

function ThemeApplet(){
    const [colorSchemes,setColorSchemes] = useState([] as IColorSchemeData[])
    const [,updateState] = useState({});
    async function loadColorSchemes(){
       const schemeFiles:any = await invoke("listdir",{dir:APPDIR+"color-schemes/"});
       let schemes:IColorSchemeData[] = [] as IColorSchemeData[];
       schemeFiles.forEach((element:any) => {
        readTextFile(`${APPDIR}color-schemes/${element}`).then((ret)=>{
            let _json:any = JSON.parse(ret);
            let scheme = {SchemeFileName:element,ColorSchemeName: _json.name || element} as IColorSchemeData;
            schemes.push(scheme);
        });
       });
       setColorSchemes(schemes);
    }
    function schemeIndexCounter(schemes:IColorSchemeData[],t:Theme){
        let i:number = 0;
        schemes.forEach((s)=>{
            switch (t){
                case Theme.Dark:
                    if (s.SchemeFileName===GlobalSettings.DarkSchemeFile){
                        return i;
                    }
                    break;
                
                case Theme.Light:
                    if (s.SchemeFileName===GlobalSettings.LightSchemeFile){
                        return i;
                    }
                    break;

                default:
                    return 0;
            }
            i++;
        });
    }
    function SaveColorSchemes(){
        let lightSchemeChooser:any=document.getElementById("lightColorScheme");
        let darkSchemeChooser:any=document.getElementById("darkColorScheme");
        GlobalSettings.DarkSchemeFile=darkSchemeChooser.value;
        GlobalSettings.LightSchemeFile=lightSchemeChooser.value;
        console.log("[INFO] Saving user color scheme preferences.");
        SaveAllSettings();
        SetupThemes().then(()=>{ApplyTheme(GlobalSettings.ThemeMode);});
        LoadColorSchemes();
    }
    LoadColorSchemes=loadColorSchemes;
    function setLightTheme(){
        console.log("[INFO] Theme preference has been changed to light theme.");
        GlobalSettings.ThemeMode=Theme.Light;
        SaveAllSettings();
        SetupThemes().then(()=>{ApplyTheme(Theme.Light);});
        updateState({});
    }
    
    function setDarkTheme(){
        console.log("[INFO] Theme preference has been changed to dark theme.");
        GlobalSettings.ThemeMode=Theme.Dark;
        SaveAllSettings();
        SetupThemes().then(()=>{ApplyTheme(Theme.Dark);});
        updateState({});
    }
    
    
    return <div className=" background-secondary p-4 my-4 rounded-2xl border-default shadow-default">
        <span className="text-2xl m-4 font-bold block text-default">Theme</span>
        <div className="inline-block p-2">
            <div className="float-left text-center m-4">
                <div onClick={setLightTheme} style={{boxShadow: GlobalSettings.ThemeMode==Theme.Light ? "0px 0px 0px 3px #6d9dc4" : ""}} className="w-40 bg-white  shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-black text-3xl bi-brightness-high-fill"></i></div>
                <span className="text-default inline-block p-2 text-center">Light</span>
            </div>
            <div className="float-left text-center m-4">
                <div onClick={setDarkTheme} style={{boxShadow: GlobalSettings.ThemeMode==Theme.Dark ? "0px 0px 0px 3px #6d9dc4" : ""}} className="w-40 bg-black shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-white text-3xl bi-moon"></i></div>
                <span className="text-default inline-block p-2 text-center">Dark</span>
            </div>
        </div>
        <div>
            <span className="p-4">Light color scheme: </span>
            <select id="lightColorScheme" value={GlobalSettings.LightSchemeFile||"colors_light.json"} onChange={SaveColorSchemes} className="dropdown">
                {colorSchemes.map(s=><option value={s.SchemeFileName}>
                    {s.ColorSchemeName}
                </option>)}
            </select>
        </div>
        <br></br>
        <div>
            <span className="p-4">Dark color scheme: </span>
            <select id="darkColorScheme" value={GlobalSettings.DarkSchemeFile||"colors_dark.json"} onChange={SaveColorSchemes} className="dropdown">
            {colorSchemes.map(s=><option value={s.SchemeFileName}>
                    {s.ColorSchemeName}
                </option>)}
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


interface IColorSchemeData{
    SchemeFileName:string,
    ColorSchemeName:string
}

export {ThemeApplet,LoadColorSchemes};