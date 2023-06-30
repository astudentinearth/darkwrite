/* eslint-disable @typescript-eslint/no-explicit-any */
import AppletBase from "../components/SettingsApplet";
import thirdParty from '../../3rd-party-licenses.txt?raw'
import cargoLicenses from "../../3rd-party-cargo.json?raw"
import { useContext, useRef, useState } from "react";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";
export function Acknowledgements(){
    const textRef = useRef<HTMLDivElement>(null);
    const [showCrates, updateShowCrates] = useState(false);
    const {locale} = useContext(LocaleContext);
    return <AppletBase title={GetLocalizedResource("ossLicensesAppletTitle",locale)}>
        <div onClick={()=>{textRef.current?.style.setProperty("display","block")}} className="hover:underline cursor-pointer text-accent m-2 ">{GetLocalizedResource("ossLicensesViewForNPM",locale)}</div>
        <div ref={textRef} className="hidden">
            {thirdParty}</div>
        <div onClick={()=>{updateShowCrates(true)}} className="hover:underline cursor-pointer text-accent m-2 ">{GetLocalizedResource("ossLicensesViewForRS",locale)}</div>
        <div>
            {showCrates ? JSON.parse(cargoLicenses).third_party_libraries.map((x:any)=><div key={x.package_name}>
                <span className="text-2xl font-bold">{x.package_name}</span><span className="p-2 text-sm">{x.license}</span>
                <hr></hr>
                {x.licenses.map((l:any) => <p key={l.license} className="text-sm">{l.text}</p>)}
            </div>) :<></>}
        </div>    
    </AppletBase>
}