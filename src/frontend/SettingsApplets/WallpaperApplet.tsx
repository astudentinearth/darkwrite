import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, copyFile } from "@tauri-apps/api/fs";
import { useContext, useRef } from "react";
import { SettingsContext } from "../../data/SettingsContext";
import { ApplyWallpaper, DeleteWallpaper } from "../../Theme";
import { Button, ButtonColor, ButtonShape } from "../components/Button";
import AppletBase from "../components/SettingsApplet";
import { Slider } from "../components/Slider";
import { GetLocalizedResource, LocaleContext } from "../../localization/LocaleContext";

function WallpaperApplet(){
    const blurValRef = useRef<HTMLSpanElement>(null);
    const brightnessValRef = useRef<HTMLSpanElement>(null);
    const grayscaleValRef = useRef<HTMLSpanElement>(null);
    const {settings, updateSettings} = useContext(SettingsContext);
    const {locale} = useContext(LocaleContext);
    return<AppletBase title={GetLocalizedResource("wallpaperAppletTitle",locale)}>
        <div className="flex-col gap-2 flex">
            <div className="flex flex-col gap-2">
                <span ref={blurValRef} className="block">{GetLocalizedResource("wallpaperAppletBlurLabel",locale)}: {settings.WallpaperBlurRadius}px</span>
                <Slider defaultValue={settings.WallpaperBlurRadius} min={0} max={64} onChange={(event)=>{
                    if(event.target!=null && blurValRef.current!=null){
                        blurValRef.current.innerText="Blur: " + (event.target as HTMLInputElement).value + "px";
                    }
                    updateSettings({...settings, WallpaperBlurRadius: (parseInt((event.target as HTMLInputElement).value))});
                }}></Slider>
            </div>
            <div className="flex flex-col gap-2">
                <span ref={brightnessValRef} className="block">{GetLocalizedResource("wallpaperBrightnessLabel",locale)}: {settings.WallpaperBrightness}%</span>
                <Slider defaultValue={settings.WallpaperBrightness} min={0} max={200} onChange={(event)=>{
                    if(event.target!=null && brightnessValRef.current!=null){
                        brightnessValRef.current.innerText=GetLocalizedResource("wallpaperBrightnessLabel", locale)+ ": " + (event.target as HTMLInputElement).value + "%";
                    }
                    updateSettings({...settings, WallpaperBrightness: (parseInt((event.target as HTMLInputElement).value))});
                }}></Slider>
            </div>
            <div className="flex flex-col gap-2">
                <span ref={grayscaleValRef} className="block">{GetLocalizedResource("wallpaperGrayscaleLabel",locale)}: {settings.WallpaperGrayscale}%</span>
                <Slider defaultValue={settings.WallpaperGrayscale} min={0} max={100} onChange={(event)=>{
                    if(event.target!=null && grayscaleValRef.current!=null){
                        grayscaleValRef.current.innerText=GetLocalizedResource("wallpaperGrayscaleLabel", locale)+ ": " + (event.target as HTMLInputElement).value + "%";
                    }
                    updateSettings({...settings, WallpaperGrayscale: (parseInt((event.target as HTMLInputElement).value))});
                }}></Slider>
            </div>
            <div className="flex items-center mt-2 justify-center gap-6 text-center">
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