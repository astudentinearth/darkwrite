import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";
import { useContext,useEffect, useRef, useState } from "react";
import { GlobalSettings, SaveAllSettings, SettingsContext } from "../../GlobalSettings";
import { ApplyTheme, HexToRGB, RGBToHex, SetupThemes, Theme } from "../../Theme";
import AppletBase from "../Components/SettingsApplet";

interface IColorSchemeData{
	SchemeFileName:string,
	ColorSchemeName:string
}

function ThemeOptions(){
    const [,updateState] = useState({});
    const [colors,setColors] = useState([] as IColorSchemeData[]);
    const settingsContext = useContext(SettingsContext);
    const {settings,updateSettings} = settingsContext;

    let select_dark:any = useRef(null);
    let select_light:any = useRef(null);
    function ChangeTheme(mode:Theme){
        updateSettings({...settings,ThemeMode:mode})
        //SaveAllSettings(settingsContext);
        SetupThemes(settingsContext).then(()=>{ApplyTheme(settings.ThemeMode, settingsContext);});
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
                    }} onClick={()=>{ChangeTheme(Theme.Light)}} style={{boxShadow: settings.ThemeMode===Theme.Light ? "0px 0px 0px 3px rgb(var(--accent))" : ""}} className="w-40 bg-white  shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-black text-3xl bi-brightness-high-fill"></i></div>
                    <span className="text-default inline-block p-2 text-center">Light</span>
                </div>
                <div className="float-left text-center m-4">
                    <div onClick={()=>{ChangeTheme(Theme.Dark)}} style={{boxShadow: settings.ThemeMode===Theme.Dark ? "0px 0px 0px 3px rgb(var(--accent))" : ""}} className="w-40 bg-black shadow-default-hover h-24 rounded-xl flex justify-center items-center"><i className="text-white text-3xl bi-moon"></i></div>
                    <span className="text-default inline-block p-2 text-center">Dark</span>
                </div>
            
		</div>
        <div className="flex h-12 items-center p-2 justify-center">
            <span>Accent color:&nbsp;</span>
            <input type="color"
             defaultValue={RGBToHex(settings.AccentColor)}
             className="appearance-none w-6 outline-none border-none rounded-full bg-transparent"
             onChange={(event:any)=>{
                let rgb:any = HexToRGB(event.target.value);
                updateSettings({...settings,AccentColor:rgb.r+" "+rgb.g+" "+rgb.b});
                document.documentElement.style.setProperty("--accent",settings.AccentColor);
             }}
             onBlur={()=>{
                //SaveAllSettings(settingsContext);
             }}></input>
        </div>
        <div className="flex justify-center items-center">
            <div className="overflow-y-scroll select-none float-left w-48 h-48 rounded-2xl bg-secondary shadow-lg" >
                <span className="text-center block">Light colors</span>
                {colors.map(e=><div className="p-2 hover:bg-hover cursor-pointer" 
                style={settings.LightSchemeFile===e.SchemeFileName ? {background: "rgb(var(--accent))", color:"white"}:{}}
                onClick={()=>{
                    if(e.SchemeFileName!==settings.LightSchemeFile){
                        updateSettings({...settings,LightSchemeFile:e.SchemeFileName});
                        //SaveAllSettings(settingsContext);
                        updateState({});
                    }
                }}
                >{e.ColorSchemeName}</div>)}
            </div>
            <div className="overflow-y-scroll select-none mx-2 w-48 h-48 rounded-2xl bg-secondary shadow-lg" >
                <span className="text-center block">Dark colors</span>
                {colors.map(e=><div className="p-2 hover:bg-hover cursor-pointer" 
                style={settings.DarkSchemeFile===e.SchemeFileName ? {background: "rgb(var(--accent))", color:"white"}:{}}
                onClick={()=>{
                    if(e.SchemeFileName!==settings.DarkSchemeFile){
                        updateSettings({...settings,DarkSchemeFile:e.SchemeFileName});
                        //SaveAllSettings(settingsContext);
                        updateState({});
                    }
                }}>{e.ColorSchemeName}</div>)}
            </div>
        </div>
    </AppletBase>
}

export default ThemeOptions;