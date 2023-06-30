import { invoke } from "@tauri-apps/api";
import { appConfigDir } from "@tauri-apps/api/path";
import {save} from "@tauri-apps/api/dialog"

export async function exportApplicationData(){
    const dir = await appConfigDir();
    const filename = await save({filters: [{name: "Zip Archive", extensions: ['zip']}], defaultPath: "data.zip"});
    if(filename==null) return;
    invoke("export_data",{dir: dir, filename: filename})
}