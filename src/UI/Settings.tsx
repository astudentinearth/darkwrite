import React, { useState } from "react";
import {ThemeApplet,LoadColorSchemes} from "./SettingsApplets/ThemeApplet";
import About from "./SettingsApplets/About";
import {SaveAllSettings,LoadSettings,GlobalSettings} from "../GlobalSettings"
import DebugInfo from "./SettingsApplets/DebugInfo";
import ToolbarButton from "./Components/ToolbarButton";
let ShowSettings:any;
function Settings(){
    const [visibility,setVisibility] = useState("none");
    function showSettings(){
        console.log("showing settings");
        LoadColorSchemes();
        setVisibility("block");
    }
    ShowSettings=showSettings;
    function hideSettings(){
        setVisibility("none");
        SaveAllSettings();
    }
    return <div className={"background-default absolute left-0  p-4 z-20 right-0 top-0 bottom-0 "} style={{display:visibility}} id="settingsUI">
        <div className="w-full ">
            <div className="flex items-center">
                <ToolbarButton onClick={hideSettings} icon="bi-chevron-left" float="float-left"></ToolbarButton>
                <span className="text-2xl m-4 font-bold">Settings</span>
            </div>

            <ThemeApplet></ThemeApplet>
            <About></About>
            <DebugInfo></DebugInfo>
        </div>
    </div>
}


export {Settings,ShowSettings};