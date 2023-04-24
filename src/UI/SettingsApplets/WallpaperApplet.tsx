import { open } from "@tauri-apps/api/dialog";
import { BaseDirectory, copyFile, exists, readBinaryFile, removeFile, writeTextFile } from "@tauri-apps/api/fs";
import AppletBase from "../Components/SettingsApplet";
import { ApplyWallpaper, DeleteWallpaper } from "../../Theme";
import { invoke } from "@tauri-apps/api";
import { Uint8ArrayToBase64 } from "../../Util";
import { Button, ButtonColor, ButtonShape } from "../Components/Button";

function WallpaperApplet(){
    return<AppletBase title="Wallpaper">
        <div className="flex items-center justify-center">
            <div className="bg-accent drop-shadow-md p-2 mx-2
            inline-block hover:brightness-125 cursor-pointer rounded-xl"
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
            }}>Choose wallpaper</div>
            <div className="bg-secondary drop-shadow-md p-2 mx-2
            inline-block hover:brightness-125 cursor-pointer rounded-xl" onClick={async ()=>{
              await DeleteWallpaper();
            }}>Remove wallpaper</div><br></br>
        </div> 
    </AppletBase>
}

export default WallpaperApplet;