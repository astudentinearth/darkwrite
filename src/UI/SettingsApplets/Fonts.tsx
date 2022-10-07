import { useRef } from "react";
import { GlobalSettings, SaveAllSettings } from "../../GlobalSettings";
import AppletBase from "../Components/SettingsApplet";

function FontOptions(){
    const uiFontRef:any = useRef(null);
    const sansFontRef:any = useRef(null);
    const serifFontRef:any = useRef(null);
    const monoFontRef:any = useRef(null);
    const handFontRef:any = useRef(null);
    return <AppletBase title="Fonts">
        <div className="">
                <div className="flex items-center justify-end m-2">
                    <span className="mr-auto">User Interface:</span>
                    <input ref={uiFontRef} defaultValue={GlobalSettings.Font}
                    onBlur={(e)=>{
                        GlobalSettings.Font=e.target.value;
                        SaveAllSettings();
                    }}
                    onKeyDown={(e)=>{
                        if(e.keyCode===13){
                            uiFontRef.current.blur();
                        }
                    }}
                    className="appaearance-none bg-secondary drop-shadow-md rounded-lg w-48 text-center"></input>
                </div>
                <div className="flex justify-end items-center m-2">
                    <span className="mr-auto">Normal:</span>
                    <input
                    onBlur={(e)=>{
                        GlobalSettings.SansFont=e.target.value;
                        SaveAllSettings();
                    }}
                    onKeyDown={(e)=>{
                        if(e.keyCode===13){
                            sansFontRef.current.blur();
                        }
                    }}
                    ref={sansFontRef} defaultValue={GlobalSettings.SansFont} className="appaearance-none text-center f-sans w-48 bg-secondary drop-shadow-md rounded-lg"></input>
                </div>
                <div className="flex justify-end items-center m-2">
                    <span className="mr-auto">Serif:</span>
                    <input
                    onBlur={(e)=>{
                        GlobalSettings.SerifFont=e.target.value;
                        SaveAllSettings();
                    }}
                    onKeyDown={(e)=>{
                        if(e.keyCode===13){
                            serifFontRef.current.blur();
                        }
                    }} ref={serifFontRef} defaultValue={GlobalSettings.SerifFont} className="appaearance-none text-center w-48 f-serif bg-secondary drop-shadow-md rounded-lg"></input>
                </div>
                <div className="flex justify-end items-center m-2">
                    <span className="mr-auto">Handwriting:</span>
                    <input
                    onBlur={(e)=>{
                        GlobalSettings.HandwritingFont=e.target.value;
                        SaveAllSettings();
                    }}
                    onKeyDown={(e)=>{
                        if(e.keyCode===13){
                            handFontRef.current.blur();
                        }
                    }} ref={handFontRef} defaultValue={GlobalSettings.HandwritingFont} className="appaearance-none text-center w-48 f-hand bg-secondary drop-shadow-md rounded-lg"></input>
                </div>
                <div className="flex justify-end items-center m-2">
                    <span className="mr-auto">Monospace:</span>
                    <input
                    onBlur={(e)=>{
                        GlobalSettings.MonospaceFont=e.target.value;
                        SaveAllSettings();
                    }}
                    onKeyDown={(e)=>{
                        if(e.keyCode===13){
                            monoFontRef.current.blur();
                        }
                    }} ref={monoFontRef} defaultValue={GlobalSettings.MonospaceFont} className="appaearance-none text-center w-48 f-mono bg-secondary drop-shadow-md rounded-lg"></input>
                </div>
        </div>
    </AppletBase>
}

export default FontOptions;