import { useContext, useRef } from "react";
import { SettingsContext } from "../../GlobalSettings";
import AppletBase from "../Components/SettingsApplet";

function FontOptions(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uiFontRef:any = useRef(null);
    const settingsContext = useContext(SettingsContext);
    const {settings,updateSettings} = settingsContext;
    return <AppletBase title="Fonts">
        <div className="">
                <div className="flex items-center justify-end m-2">
                    <span className="mr-auto">User Interface:</span>
                    <input ref={uiFontRef} defaultValue={settings.Font}
                    onBlur={(e)=>{
                        updateSettings({...settings,Font:e.target.value});
                        //SaveAllSettings(settingsContext);
                    }}
                    onKeyDown={(e)=>{
                        if(e.key=="Enter"){
                            uiFontRef.current.blur();
                        }
                    }}
                    className="appaearance-none bg-secondary drop-shadow-md rounded-lg w-48 text-center"></input>
                </div>
        </div>
    </AppletBase>
}

export default FontOptions;