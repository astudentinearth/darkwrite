import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";
import { useContext,useEffect, useRef, useState } from "react";
import { GlobalSettings, SaveAllSettings, SettingsContext } from "../../GlobalSettings";
import { ApplyTheme, HexToRGB, RGBToHex, SetupThemes } from "../../Theme";
import AppletBase from "../Components/SettingsApplet";

interface IColorSchemeData{
	SchemeFileName:string,
	ColorSchemeName:string,
    background:string,
    foreground:string,
    secondaryBackground:string,
    hoverBackground:string,
    activeBackground:string,
    shadow:string,
    disabledText:string,
    disabledBackground:string
}

function ThemeOptions(){
    const [,updateState] = useState({});
    const [colors,setColors] = useState([] as IColorSchemeData[]);
    const settingsContext = useContext(SettingsContext);
    const {settings,updateSettings} = settingsContext;

    let select_dark:any = useRef(null);
    let select_light:any = useRef(null);
    function ChangeTheme(themeFile:string){
        updateSettings({...settings,ThemeFile:themeFile})
        //SaveAllSettings(settingsContext);
        SetupThemes(settingsContext).then(()=>{ApplyTheme(settings.ThemeFile, settingsContext);});
        updateState({});
    }
    useEffect(()=>{
        const loadSchemes = async () => {
            const fsEntries = await readDir("color-schemes",{dir:BaseDirectory.App});
            let fileNames=fsEntries.map(e => e.name);
            let schemes:IColorSchemeData[] = [] as IColorSchemeData[];
            for(const f of fileNames){
                if (!f) return;
                const contents = await readTextFile("color-schemes/"+f,{dir:BaseDirectory.App});
                let _json = JSON.parse(contents);
                let scheme: IColorSchemeData = {SchemeFileName: f, 
                    ColorSchemeName: _json.name ?? "Unnamed Theme",
                    background: _json.background ?? "57 57 57",
                    foreground: _json.foreground ?? "#ffffff",
                    secondaryBackground: _json["background-secondary"] ?? "73 73 73",
                    hoverBackground: _json["background-hover"] ?? "86 86 86",
                    activeBackground: _json["background-active"] ?? "96 96 96",
                    shadow: _json.shadow ?? "rgba(0,0,0,0.2)",
                    disabledText: _json["text-disabled"] ?? "170 170 170",
                    disabledBackground: _json["background-disabled"] ?? "89 89 89"
                }
                schemes.push(scheme);
            }
            console.log(schemes);
            setColors(schemes);
             };
        loadSchemes()
        
    },[]);
    return <AppletBase title="Colors">
            <div className="overflow-y-scroll select-none mx-2 rounded-2xl bg-secondary shadow-lg" >
                {colors.map(e=><div className="p-2 hover:bg-hover cursor-pointer 
                rounded-2xl w-48 h-12 flex items-center flex-row float-left m-2" 
                style={settings.ThemeFile===e.SchemeFileName ? {background: "rgb(var(--accent))", color:"white"}:{}}
                onClick={()=>{
                    if(e.SchemeFileName!==settings.ThemeFile){
                        updateSettings({...settings,ThemeFile:e.SchemeFileName});
                        //SaveAllSettings(settingsContext);
                        updateState({});
                    }
                }}>
                    <div className="rounded-lg h-8 w-8 note-shadow" style={{background: `rgb(${e.background})`}}>
                        <div className="w-3 h-6 m-1 rounded-md note-shadow" style={{background: `rgb(${e.secondaryBackground})`}}></div>
                    </div>
                    <span className="ml-4">{e.ColorSchemeName}</span>
                    
                </div>)}
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
        
    </AppletBase>
}

export default ThemeOptions;