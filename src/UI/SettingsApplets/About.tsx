import React, { useContext } from "react";
import logo from "./darkwrite_icon.png"
import { GlobalSettings, SettingsContext } from "../../GlobalSettings";
import { openURL } from "../../API";

function About(){
    const context = useContext(SettingsContext);
    return <div className="background-secondary items-center p-4 rounded-2xl border-default shadow-default my-4">
        
        <img className="float-left" alt="darkwrite_logo" src={logo} width={128} height={128}></img>
        <div className="float-left">
            <span className="text-2xl m-2 font-bold block text-default">About</span>
            <span className="text-xl m-2 block text-default">Darkwrite {context.settings.Version}</span>
            <div className="hover:underline cursor-pointer text-accent m-2 " onClick={()=>{openURL("https://github.com/astudentinearth/darkwrite/blob/master/LICENSE")}}>License Information</div>
        </div>
        <div className="clear-both"></div>
    </div>
}

export default About;