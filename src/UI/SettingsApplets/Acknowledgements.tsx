/* eslint-disable @typescript-eslint/no-explicit-any */
import AppletBase from "../Components/SettingsApplet";
import thirdParty from '../../3rd-party-licenses.txt?raw'
import cargoLicenses from "../../3rd-party-cargo.json?raw"
import { useRef, useState } from "react";

export function Acknowledgements(){
    const textRef = useRef<HTMLDivElement>(null);
    const [showCrates, updateShowCrates] = useState(false);
    return <AppletBase title="Open Source Licenses">
        <div onClick={()=>{textRef.current?.style.setProperty("display","block")}} className="hover:underline cursor-pointer text-accent m-2 ">View licenses for npm packages</div>
        <div ref={textRef} className="hidden">
            {thirdParty}</div>
        <div onClick={()=>{updateShowCrates(true)}} className="hover:underline cursor-pointer text-accent m-2 ">View licenses for Rust crates</div>
        <div>
            {showCrates ? JSON.parse(cargoLicenses).third_party_libraries.map((x:any)=><div key={x.package_name}>
                <span className="text-2xl font-bold">{x.package_name}</span><span className="p-2 text-sm">{x.license}</span>
                <hr></hr>
                {x.licenses.map((l:any) => <p key={l.license} className="text-sm">{l.text}</p>)}
            </div>) :<></>}
        </div>    
    </AppletBase>
}