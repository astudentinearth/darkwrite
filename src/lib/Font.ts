import { invoke } from "@tauri-apps/api";

/** Gets all fonts installed on the system. Uses font-loader crate. Fontconfig is required on Linux. */

export async function getFonts() {
    if (window.__TAURI__ != null) { // Running on desktop
        const f = ((await invoke("get_fonts")) as string[]);
        if (!f.includes("Roboto")) f.push("Roboto");
        if (!f.includes("Roboto Mono")) f.push("Roboto Mono");
        if (!f.includes("Roboto Slab")) f.push("Roboto Slab");
        if (!f.includes("Yellowtail")) f.push("Yellowtail");
        const fonts = f.sort(((a, b) => { return (a).localeCompare(b); }));
        return [...new Set(fonts)];
    }
    else {
        const fonts = [...document.fonts.values()];
        const families = fonts.map(font => font.family);
        return [...new Set(families)];
    }
}