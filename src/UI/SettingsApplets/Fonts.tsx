import { useContext, useRef } from "react";
import { SettingsContext } from "../../data/SettingsContext";
import AppletBase from "../Components/SettingsApplet";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";

function FontOptions(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uiFontRef:any = useRef(null);
    const settingsContext = useContext(SettingsContext);
    const {settings,updateSettings} = settingsContext;
    const {locale} = useContext(LocaleContext);
    return <AppletBase title={GetLocalizedResource("fontAppletTitle",locale)}>
        <div className="">
                <div className="flex items-center justify-end m-2">
                    <span className="mr-auto">{GetLocalizedResource("fontAppletUILabel",locale)}</span>
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
                    className="appaearance-none bg-widget drop-shadow-md rounded-lg w-48 h-8 text-center"></input>
                </div>
        </div>
    </AppletBase>
}

export default FontOptions;