import { invoke } from "@tauri-apps/api";

/**
 * Opens an URL in the default external browser
 * @param url Target URL
 */

export async function openURL(url: string) {
    if(window.__TAURI__ == null){ // Running in browser
        window.open(url, "_blank");
        return;
    }
    else invoke("openURL", { url: url });
}
