import React, { useEffect, useState } from "react";
import { getTauriVersion } from "@tauri-apps/api/app";
import { arch, platform, type, version } from "@tauri-apps/api/os";
function DebugInfo(){
    const [debugInfo,setDebugInfo]=useState({} as IDebugInfo);
    
    useEffect(()=>{
        const LoadDebugInfo=async ()=>{
            const info:IDebugInfo={} as IDebugInfo;
            info.tauriVersion=await getTauriVersion();
            info.architecture=await arch();
            info.operatingSystem=await type();
            info.operatingSystemVersion=await version();
            info.platform=await platform();
            info.reactVersion=React.version;
            setDebugInfo(info);
        };
        LoadDebugInfo();
    },[])
    return <div className="background-secondary items-center p-8 rounded-2xl border-default shadow-default my-4">
        <span className="text-2xl font-bold block text-default">Debug Info</span>
        <span>Tauri Version: {debugInfo.tauriVersion}</span><br></br>
        <span>Architecture: {debugInfo.architecture}</span><br></br>
        <span>OS: {debugInfo.operatingSystem}</span><br></br>
        <span>OS Version: {debugInfo.operatingSystemVersion}</span><br></br>
    </div>
}

interface IDebugInfo{
    tauriVersion:string,
    architecture:string,
    operatingSystem:string,
    operatingSystemVersion:string,
    platform:string,
    reactVersion:string
}

export default DebugInfo;