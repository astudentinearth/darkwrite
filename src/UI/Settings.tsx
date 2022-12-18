import React, { useState } from "react";
import About from "./SettingsApplets/About";
import {SaveAllSettings} from "../GlobalSettings"
import DebugInfo from "./SettingsApplets/DebugInfo";
import ToolbarButton from "./Components/ToolbarButton";
import ThemeOptions from "./SettingsApplets/ThemeOptions";
import FontOptions from "./SettingsApplets/Fonts";
import WallpaperApplet from "./SettingsApplets/WallpaperApplet";
let ShowSettings:any;
let HideSettings:any;
enum SettingsPage{
    Appearance = 0,
    About = 1
}

function SettingsView(){
    const [page,setPage] = useState(SettingsPage.Appearance);
    function SidebarButton(props:any){
        return <div onClick={props.onClick}
        className="rounded-xl hover:bg-hover flex items-center p-2 m-2 cursor-pointer active:bg-active"
        style={(props.isActive==="true" ? {background:"rgb(var(--accent))",color:"white"} : {})}>
            <i className={"text-xl "+props.icon}></i><span className="text-xl pl-2">{props.title}</span>
        </div>
    }
    function renderPage(){
            switch (page){
                case SettingsPage.Appearance:
                    return <React.Fragment><ThemeOptions></ThemeOptions><FontOptions></FontOptions><WallpaperApplet></WallpaperApplet></React.Fragment>
                
                case SettingsPage.About:
                    return <React.Fragment><About></About><DebugInfo></DebugInfo></React.Fragment>
            }
        
        return <DebugInfo></DebugInfo>
    }
    return <div>
        <div className="background-secondary w-72 h-full fixed">
            <div className="flex items-center m-2">
                <ToolbarButton onClick={HideSettings} icon="bi-chevron-left" float="float-left"></ToolbarButton>
                <span className="text-2xl font-bold">Settings</span>
            </div>
            <SidebarButton onClick={()=>{setPage(SettingsPage.Appearance)}} isActive={(page===SettingsPage.Appearance) ? "true" : ""} icon="bi-brush" title="Appearance"></SidebarButton>
            <SidebarButton onClick={()=>{setPage(SettingsPage.About)}} isActive={(page===SettingsPage.About) ? "true" : ""} icon="bi-info" title="About"></SidebarButton>
        </div>
        <div className="absolute left-72 px-4 justify-center overflow-y-scroll items-center right-0 top-0 bottom-0">
            <div className="">
                {renderPage()}
            </div>
        </div>
    </div>
}

function Settings(){
    const [visibility,setVisibility] = useState("none");
    const [,updateState]=useState({});
    function showSettings(){
        console.log("showing settings");
        updateState({});
        setVisibility("block");
    }
    ShowSettings=showSettings;
    function hideSettings(){
        setVisibility("none");
        SaveAllSettings();
    }
    HideSettings=hideSettings;
    
    return <div className={"background-default absolute left-0 z-20 right-0 top-0 bottom-0 "} style={{display:visibility}} id="settingsUI">
        {visibility==="block" ? <SettingsView></SettingsView> : <></>}
</div>
}

export {Settings,ShowSettings};
