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
    const f =((await invoke("get_fonts")) as string[]);
    if(!f.includes("Roboto")) f.push("Roboto")
    if(!f.includes("Roboto Mono")) f.push("Roboto Mono")
    if(!f.includes("Roboto Slab")) f.push("Roboto Slab")
    if(!f.includes("Yellowtail")) f.push("Yellowtail")
    const fonts = f.sort(((a,b)=>{return (a).localeCompare(b)}));
    return fonts;
}