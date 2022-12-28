import { invoke } from "@tauri-apps/api";

/**
 * Opens an URL in the default external browser
 * @param url Target URL
 */
export async function openURL(url:string){
    invoke("openURL",{url: url});
}

