import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";
import { useEffect, useRef, useState } from "react";
import { GlobalSettings, SaveAllSettings } from "../../GlobalSettings";
import { ApplyTheme, HexToRGB, RGBToHex, SetupThemes, Theme } from "../../Theme";
import AppletBase from "../Components/SettingsApplet";

interface IColorSchemeData{
	SchemeFileName:string,
	ColorSchemeName:string
}

function ThemeOptions(){
    const [,updateState] = useState({});
    const [colors,setColors] = useState([] as IColorSchemeData[]);
    let select_dark:any = useRef(null);
    let select_light:any = useRef(null);
    function ChangeTheme(mode:Theme){
        GlobalSettings.ThemeMode=mode;
        SaveAllSettings();
        SetupThemes().then(()=>{ApplyTheme(GlobalSettings.ThemeMode);});
        updateState({});
    }
    useEffect(()=>{
        const loadSchemes = async () => {
            const fsEntries = await readDir("color-schemes",{dir:BaseDirectory.App});
            let fileNames=fsEntries.map(e => e.name);
            let schemes:IColorSchemeData[] = [] as IColorSchemeData[];
            for(const f of fileNames){
                const contents = await readTextFile("color-schemes/"+f,{dir:BaseDirectory.App});
                let _json = JSON.parse(contents);
                let scheme = {SchemeFileName: f,ColorSchemeName: _json.name || f} as IColorSchemeData;
                schemes.push(scheme);
            }
            console.log(schemes);
            setColors(schemes);
             };
        loadSchemes()
        
    },[]);
    return <AppletBase title="Colors">
        <div className="flex items-center justify-center p-2">
			
                <div  className="float-left text-center m-4">
                    <div onContextMenu={(event)=>{
                        event.stopPropagation();
                        event.nativeEvent.stopImmediatePropagation();
                    }} onClick={()=>{ChangeTheme(Theme.Light)}} style={{boxShadow: GlobalSettings.ThemeMode===Theme.Light ? "0px 0px 0px 3px rgb(var(--accent))" : ""}} className="w-40 bg-white  shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-black text-3xl bi-brightness-high-fill"></i></div>
                    <span className="text-default inline-block p-2 text-center">Light</span>
                </div>
                <div className="float-left text-center m-4">
                    <div onClick={()=>{ChangeTheme(Theme.Dark)}} style={{boxShadow: GlobalSettings.ThemeMode===Theme.Dark ? "0px 0px 0px 3px rgb(var(--accent))" : ""}} className="w-40 bg-black shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-white text-3xl bi-moon"></i></div>
                    <span className="text-default inline-block p-2 text-center">Dark</span>
                </div>
            
		</div>
        <div className="flex h-12 items-center p-2 justify-center">
            <span>Accent color:&nbsp;</span>
            <input type="color"
             defaultValue={RGBToHex(GlobalSettings.AccentColor)}
             className="appearance-none w-6 outline-none border-none rounded-full bg-transparent"
             onChange={(event:any)=>{
                let rgb:any = HexToRGB(event.target.value);
                GlobalSettings.AccentColor=rgb.r+" "+rgb.g+" "+rgb.b;
                document.documentElement.style.setProperty("--accent",GlobalSettings.AccentColor);
             }}
             onBlur={()=>{
                SaveAllSettings();
             }}></input>
        </div>
        <div className="flex justify-center items-center">
            <div className="overflow-y-scroll select-none float-left w-48 h-48 rounded-2xl bg-secondary shadow-lg" >
                <span className="text-center block">Light colors</span>
                {colors.map(e=><div className="p-2 hover:bg-hover cursor-pointer" 
                style={GlobalSettings.LightSchemeFile===e.SchemeFileName ? {background: "rgb(var(--accent))", color:"white"}:{}}
                onClick={()=>{
                    if(e.SchemeFileName!==GlobalSettings.LightSchemeFile){
                        GlobalSettings.LightSchemeFile=e.SchemeFileName;
                        SaveAllSettings();
                        updateState({});
                    }
                }}
                >{e.ColorSchemeName}</div>)}
            </div>
            <div className="overflow-y-scroll select-none mx-2 w-48 h-48 rounded-2xl bg-secondary shadow-lg" >
                <span className="text-center block">Dark colors</span>
                {colors.map(e=><div className="p-2 hover:bg-hover cursor-pointer" 
                style={GlobalSettings.DarkSchemeFile===e.SchemeFileName ? {background: "rgb(var(--accent))", color:"white"}:{}}
                onClick={()=>{
                    if(e.SchemeFileName!==GlobalSettings.DarkSchemeFile){
                        GlobalSettings.DarkSchemeFile=e.SchemeFileName;
                        SaveAllSettings();
                        updateState({});
                    }
                }}>{e.ColorSchemeName}</div>)}
            </div>
        </div>
    </AppletBase>
}

export default ThemeOptions;