/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useContext, useState } from "react";
import About from "./settings/About";
import { Acknowledgements } from "./settings/Acknowledgements";
import DebugInfo from "./settings/DebugInfo";
import { DevConsole } from "./settings/DevConsole";
import FontOptions from "./settings/Fonts";
import ThemeOptions from "./settings/ThemeOptions";
import WallpaperApplet from "./settings/WallpaperApplet";
import { GetLocalizedResource, LocaleContext } from "../localization/LocaleContext";
import { SettingsContext } from "../context/SettingsContext";
//import { AdvancedSettings } from "./SettingsApplets/Advanced";
let ShowSettings:any;
let HideSettings:any;
enum SettingsPage{
    Appearance = 0,
    About = 1,
    Advanced = 2,
    Developer = 3
}

function SettingsView(){
    const [page,setPage] = useState(SettingsPage.Appearance);
    const {locale} = useContext(LocaleContext);
    const {settings, updateSettings} = useContext(SettingsContext);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function SidebarButton(props:any){
        return <div onClick={props.onClick}
        className="rounded-xl transition-colors hover:bg-hover flex items-center p-2 m-2 cursor-pointer active:bg-active"
        style={(props.isActive==="true" ? {background:"rgb(var(--accent))",color:"white"} : {})}>
            <i className={"text-xl "+props.icon}></i><span className="text-xl pl-2">{props.title}</span>
        </div>
    }
    function renderPage(){
            switch (page){
                case SettingsPage.Appearance:
                    return <React.Fragment><ThemeOptions></ThemeOptions><FontOptions></FontOptions><WallpaperApplet></WallpaperApplet></React.Fragment>
                
                case SettingsPage.About:
                    return <React.Fragment><About></About><DebugInfo></DebugInfo><Acknowledgements></Acknowledgements></React.Fragment>

                case SettingsPage.Developer:
                    return <React.Fragment><DevConsole></DevConsole></React.Fragment>

                /*case SettingsPage.Advanced:
                    return <React.Fragment><AdvancedSettings></AdvancedSettings></React.Fragment>*/
            }
        
        return <DebugInfo></DebugInfo>
    }
    return <div className="">
        <div className="bg-secondary w-72 h-full fixed">
            <button onClick={HideSettings} className="bg-transparent flex items-center p-2 m-2 hover:bg-hover rounded-xl">
                <i className="bi-chevron-left text-xl"></i> &nbsp;
                <span className="text-xl font-bold">{GetLocalizedResource("settingsTitle",locale)}</span>
            </button>
            <SidebarButton onClick={()=>{setPage(SettingsPage.Appearance)}} isActive={(page===SettingsPage.Appearance) ? "true" : ""} icon="bi-brush" title={GetLocalizedResource("appearancePageName",locale)}></SidebarButton>
            {/*<SidebarButton onClick={()=>{setPage(SettingsPage.Advanced)}} isActive={(page===SettingsPage.Advanced) ? "true" : ""} icon="bi-toggles" title="Advanced"></SidebarButton>*/}
            <SidebarButton onClick={()=>{setPage(SettingsPage.Developer)}} isActive={(page===SettingsPage.Developer) ? "true" : ""} icon="bi-terminal-fill" title={GetLocalizedResource("developerConsolePageName",locale)}></SidebarButton>
            <SidebarButton onClick={()=>{setPage(SettingsPage.About)}} isActive={(page===SettingsPage.About) ? "true" : ""} icon="bi-info" title={GetLocalizedResource("aboutPageName",locale)}></SidebarButton>
            <select onChange={(event: ChangeEvent)=>{
                if(event.target==null) return;
                updateSettings({...settings, Locale:(event.target as HTMLSelectElement).value});
            }} defaultValue={settings.Locale} className="select1 h-8 flex ml-4 bg-secondary box-shadow-4-8-20">
                <option value={"en_us"}>English</option>
                <option value={"tr_tr"}>Turkish (Türkçe)</option>
            </select>
        </div>
        <div className="absolute bg-primary left-72 px-4 overflow-y-scroll right-0 top-0 bottom-0">
            <div className="mx-auto max-w-[600px]">
                {renderPage()}
            </div>
        </div>
    </div>
}

function Settings(){
    const [visibility,setVisibility] = useState("none");
    const [,updateState]=useState({});
    document.addEventListener("keydown",(e)=>{
        if(e.key==="Escape" && visibility==="block") HideSettings();
    })
    function showSettings(){
        console.log("showing settings");
        updateState({});
        setVisibility("block");
    }
    ShowSettings=showSettings;
    function hideSettings(){
        setVisibility("none");
        //SaveAllSettings({settings,updateSettings});
    }
    HideSettings=hideSettings;
    
    return <div className={"absolute left-0 right-0 top-0 bottom-0 z-[100]"} style={{display:visibility}} id="settingsUI">
        {visibility==="block" ? <SettingsView></SettingsView> : <></>}
</div>
}

export { Settings, ShowSettings };

