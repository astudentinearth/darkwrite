import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, copyFile, exists, readBinaryFile, removeFile, writeTextFile } from "@tauri-apps/api/fs";
import AppletBase from "../Components/SettingsApplet";
import { ApplyWallpaper, DeleteWallpaper } from "../../Theme";
import { invoke } from "@tauri-apps/api";
import { Uint8ArrayToBase64 } from "../../Util";
import { Button, ButtonColor, ButtonShape } from "../Components/Button";
import { Slider } from "../Components/Slider";

function WallpaperApplet(){
    return<AppletBase title="Wallpaper">
        <div className="flex items-center gap-2 justify-center">
            <Button shape={ButtonShape.Round12} width={200} color={ButtonColor.Accent} textContent="Choose wallpaper"
            onClick={async ()=>{
                await DeleteWallpaper();
                const wp:any = await open({
                    multiple: false,
                    filters:[{
                        name: "Image",
                        extensions: ['png','jpg','jpeg']
                    }]
                });
                if(wp==null) {console.error("Wallpaper is null."); return;}
                let ext = wp.split(".").pop();
                await copyFile(wp,"wallpaper."+ext,{dir: BaseDirectory.App});
                
                /*let bin = await readBinaryFile(wp);
                let base64:any = await Uint8ArrayToBase64(bin);
                /*`data:image/${ext=="png" ? "png" : "jpeg"};base64,${base64}` 
                await writeTextFile("wallpaper.base64",base64,{dir:BaseDirectory.App});*/
                await ApplyWallpaper();
            }}></Button>
            <Button shape={ButtonShape.Round12} width={200} textContent="Remove wallpaper" onClick={async ()=>{
              await DeleteWallpaper();
            }}></Button>
        </div> 
    </AppletBase>
}

export default WallpaperApplet;