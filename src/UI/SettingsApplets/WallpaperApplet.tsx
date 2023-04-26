import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import { useContext, useRef } from "react";
import { SettingsContext } from "../../SettingsContext";
import { ApplyWallpaper, DeleteWallpaper } from "../../Theme";
import { Button, ButtonColor, ButtonShape } from "../Components/Button";
import AppletBase from "../Components/SettingsApplet";
import { Slider } from "../Components/Slider";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";

function WallpaperApplet(){
    const blurValRef = useRef<HTMLSpanElement>(null);
    const {settings, updateSettings} = useContext(SettingsContext);
    const {locale} = useContext(LocaleContext);
    return<AppletBase title={GetLocalizedResource("wallpaperAppletTitle",locale)}>
        <div className="flex-col items-center gap-2 justify-center">
            <div className="flex items-center gap-2">
                <span ref={blurValRef} className="w-24 block">{GetLocalizedResource("wallpaperAppletBlurLabel",locale)}: {settings.WallpaperBlurRadius}px</span>
                <Slider defaultValue={settings.WallpaperBlurRadius} min={0} max={64} onChange={(event)=>{
                    if(event.target!=null && blurValRef.current!=null){
                        blurValRef.current.innerText="Blur: " + (event.target as HTMLInputElement).value + "px";
                    }
                    updateSettings({...settings, WallpaperBlurRadius: (parseInt((event.target as HTMLInputElement).value))});
                }}></Slider>
            </div>
            <div className="flex items-center justify-center gap-6 text-center">
                <Button shape={ButtonShape.Round12} width={200} color={ButtonColor.Accent} textContent={GetLocalizedResource("wallpaperAppletChooseButton",locale)}
                onClick={async ()=>{
                    await DeleteWallpaper();
                    let wp:(string | string[] | null) = await open({
                        multiple: false,
                        filters:[{
                            name: "Image",
                            extensions: ['png','jpg','jpeg']
                        }]
                    });
                    if(wp==null) {console.error("Wallpaper is null."); return;}
                    wp = wp as string; // shut up string[] possibility
                    const ext = wp.split(".").pop();
                    await copyFile(wp,"wallpaper."+ext,{dir: BaseDirectory.App});
                    
                    /*let bin = await readBinaryFile(wp);
                    let base64:any = await Uint8ArrayToBase64(bin);
                    /*`data:image/${ext=="png" ? "png" : "jpeg"};base64,${base64}` 
                    await writeTextFile("wallpaper.base64",base64,{dir:BaseDirectory.App});*/
                    await ApplyWallpaper();
                }}></Button>
                <Button shape={ButtonShape.Round12} width={200} textContent={GetLocalizedResource("wallpaperAppletRemoveButton",locale)} onClick={async ()=>{
                await DeleteWallpaper();
                }}></Button>
            </div>
        </div> 
    </AppletBase>
}

export default WallpaperApplet;