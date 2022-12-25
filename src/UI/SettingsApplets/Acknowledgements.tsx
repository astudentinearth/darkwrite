import AppletBase from "../Components/SettingsApplet";
import thirdParty from '../../3rd-party-licenses.txt?raw'
import { useRef } from "react";

export function Acknowledgements(){
    let textRef:any = useRef(null);
    return <AppletBase title="Open Source Licenses">
        <div onClick={()=>{textRef.current.style.setProperty("display","block")}} className="hover:underline cursor-pointer text-accent m-2 ">View</div>
        <div ref={textRef} className="hidden">{thirdParty}</div>
    </AppletBase>
}