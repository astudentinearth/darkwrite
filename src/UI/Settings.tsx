import React from "react";
import ThemeApplet from "./SettingsApplets/ThemeApplet";
import About from "./SettingsApplets/About";
import {SaveAllSettings,LoadSettings,GlobalSettings} from "../GlobalSettings"
import DebugInfo from "./SettingsApplets/DebugInfo";
function Settings(){
    return <div className="background-default absolute left-0 hidden p-4 z-20 right-0 top-0 bottom-0" id="settingsUI">
        <div className="w-full ">
            <div className="flex items-center">
                <div onClick={CloseSettingsUI} className="h-14 border-default active:scale-90 w-14 float-left rounded-2xl flex cursor-pointer shadow-default-hover background-default align-middle justify-center items-center"><i className="bi-chevron-left text-default text-3xl"></i></div>
                <span className="text-2xl m-4 font-bold">Settings</span>
            </div>

            <ThemeApplet></ThemeApplet>
            <About></About>
            <DebugInfo></DebugInfo>
        </div>
    </div>
}

function CloseSettingsUI(){
    let settingsUI:any =document.getElementById("settingsUI");
    settingsUI.style.setProperty("display","none");
    SaveAllSettings();
}
export default Settings;