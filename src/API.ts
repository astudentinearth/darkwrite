import { invoke } from "@tauri-apps/api";

/**
 * Opens an URL in the default external browser
 * @param url Target URL
 */
export async function openURL(url:string){
    invoke("openURL",{url: url});
}

/** Gets all fonts installed on the system. Uses font-loader crate. Fontconfig is required on Linux. */
export async function getFonts(){
    return ((await invoke("get_fonts")) as string[]);
}