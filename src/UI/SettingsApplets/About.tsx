import React from "react";
import logo from "./darkwrite_icon.png"
import { GlobalSettings } from "../../GlobalSettings";
function About(){
    return <div className="h-48 background-secondary items-center p-4 rounded-2xl border-default shadow-default my-4">
        
        <img className="float-left" src={logo} width={128} height={128}></img>
        <div className="float-left">
            <span className="text-2xl m-2 font-bold block text-default">About</span>
            <span className="text-xl m-2 block text-default">Darkwrite {GlobalSettings.Version}</span>
            <div className="button m-2 float-left">License Information</div>
        </div>
    </div>
}
//
export default About;