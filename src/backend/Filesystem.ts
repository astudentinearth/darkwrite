import { invoke } from "@tauri-apps/api";

export async function isDirectory(path:string){
    return await invoke("is_directory", {path:path});
}