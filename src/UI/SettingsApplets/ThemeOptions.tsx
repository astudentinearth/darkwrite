import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";
import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { SettingsContext } from "../../SettingsContext";
import { HexToRGB, RGBToHex } from "../../Theme";
import AppletBase from "../Components/SettingsApplet";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";
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
    const {locale} = useContext(LocaleContext);
    useEffect(()=>{
        const loadSchemes = async () => {
            const fsEntries = await readDir("color-schemes",{dir:BaseDirectory.App});
            const fileNames=fsEntries.map(e => e.name);
            const schemes:IColorSchemeData[] = [] as IColorSchemeData[];
            for(const f of fileNames){
                if (!f) return;
                const contents = await readTextFile("color-schemes/"+f,{dir:BaseDirectory.App});
                const _json = JSON.parse(contents);
                const scheme: IColorSchemeData = {SchemeFileName: f, 
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
    return <AppletBase title={GetLocalizedResource("themeAppletTitle",locale)}>
            <div className="overflow-y-scroll select-none mx-2 rounded-2xl flex flex-row flex-wrap bg-secondary shadow-lg" >
                {colors.map(e=><div key={e.SchemeFileName} className="p-2 hover:bg-hover cursor-pointer transition-all
                rounded-2xl w-40 h-12 flex items-center flex-row m-2" 
                style={settings.ThemeFile===e.SchemeFileName ? {background: "rgb(var(--accent))", color:"white"}:{}}
                onMouseEnter={(event:MouseEvent<HTMLDivElement>)=>{
                    if(settings.ThemeFile===e.SchemeFileName) (event.target as HTMLDivElement).style.setProperty("filter","brightness(120%)");
                }}
                onMouseLeave={(event:MouseEvent<HTMLDivElement>)=>{
                    if(settings.ThemeFile===e.SchemeFileName) (event.target as HTMLDivElement).style.setProperty("filter","");
                }}
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
            <span>{GetLocalizedResource("themeAppletAccentColorLabel",locale)}:&nbsp;</span>
            <input type="color"
             defaultValue={RGBToHex(settings.AccentColor)}
             className="appearance-none w-6 outline-none border-none rounded-full bg-transparent"
             onChange={(event:ChangeEvent)=>{
                if(event.target==null) return;
                const rgb = HexToRGB((event.target as HTMLInputElement).value);
                if(rgb==null) return;
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