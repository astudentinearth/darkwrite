import { open } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";
import { BaseDirectory, copyFile, removeFile } from "@tauri-apps/api/fs";
import AppletBase from "../Components/SettingsApplet";
import { ApplyWallpaper } from "../../Theme";
import { invoke } from "@tauri-apps/api";

function WallpaperApplet(){
    return<AppletBase title="Wallpaper">
        <div className="flex items-center justify-center">
            <div className="bg-accent drop-shadow-md p-2 mx-2
            inline-block hover:brightness-125 cursor-pointer rounded-xl"
            onClick={async ()=>{
                const wp:any = await open({
                    multiple: false,
                    filters:[{
                        name: "Image",
                        extensions: ['png','jpg','jpeg']
                    }]
                });
                if(wp==null) {console.error("Wallpaper is null."); return;}
                let ext = wp.split(".").pop();
                await copyFile(wp,(await appDir()+"wallpaper."+ext));
                await ApplyWallpaper();
            }}>Choose wallpaper</div>
            <div className="bg-secondary drop-shadow-md p-2 mx-2
            inline-block hover:brightness-125 cursor-pointer rounded-xl" onClick={async ()=>{
                if (await invoke("path_exists",{targetPath: await appDir()+"wallpaper.png"})) removeFile("wallpaper.png",{dir:BaseDirectory.App});
                if (await invoke("path_exists",{targetPath: await appDir()+"wallpaper.jpg"})) removeFile("wallpaper.jpg",{dir:BaseDirectory.App});
                if (await invoke("path_exists",{targetPath: await appDir()+"wallpaper.jpeg"})) removeFile("wallpaper.jpeg",{dir:BaseDirectory.App});
                let approot:any = document.querySelector(".app_root");
                approot.style.setProperty("background-image","");
            }}>Remove wallpaper</div><br></br>
        </div>
    </AppletBase>
}

export default WallpaperApplet;