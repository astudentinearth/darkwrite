import { useContext, useEffect, useState } from "react";
import { openURL } from "../../lib/API";
import { SettingsContext } from "../../data/SettingsContext";
import logo from "/res/darkwrite_icon.png";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";
import {getVersion} from "@tauri-apps/api/app";

function About(){
    const context = useContext(SettingsContext);
    const {locale} = useContext(LocaleContext);
    const [version,setVersion] = useState<string>("");
    useEffect(()=>{
        const lv = async()=>{
            setVersion(await getVersion());
        }
        lv();
    },[]);
    return <div className="background-secondary items-center p-4 rounded-2xl border-default shadow-default my-4">
        
        <img className="float-left" alt="darkwrite_logo" src={logo} width={128} height={128}></img>
        <div className="float-left">
            <span className="text-2xl m-2 font-bold block text-default">{GetLocalizedResource("aboutAppletTitle",locale)}</span>
            <span className="text-xl m-2 block text-default">Darkwrite {version}</span>
            <div className="hover:underline cursor-pointer text-accent m-2 " onClick={()=>{openURL("https://github.com/astudentinearth/darkwrite/blob/master/LICENSE")}}>{GetLocalizedResource("aboutAppletLicenseLink",locale)}</div>
        </div>
        <div className="clear-both"></div>
    </div>
}

export default About;
