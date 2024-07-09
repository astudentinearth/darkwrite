import { FileHandle, open, writeFile } from "fs/promises";
import { app } from "electron";
import { join } from "path";
import { DEFAULT_USER_SETTINGS, UserSettings, buildUserSettings } from "@common/settings";
import { isNodeError, isValidJSON } from "../util";

const dir = process.env["NODE_ENV"] === "test" ? "./data/" :  app.getPath("userData"); // check env here for test convenience
const filename = join(dir, "settings.json")

export async function createSettingsFile(){
    console.log("[INFO] Creating user settings file");
    const defaults = JSON.stringify(DEFAULT_USER_SETTINGS); // write defaults
    await writeFile(filename, defaults, "utf-8");
}

//TODO: Use a proper logger
export async function readUserPrefs(){
    console.log("[INFO] Loading user settings")
    try{
        let handle: FileHandle;
        try {
            handle = await open(filename, "r+");
        } catch (error) {
            if(!isNodeError(error)) {throw error}
            if(error.code === 'ENOENT'){ // the file might not be there
                console.log("[INFO] Settings file not found.");
                await createSettingsFile();
                console.log("[INFO] Trying to open file again");
                handle = await open(filename, "r+")
            } else throw error;
        }
        console.log("[INFO] Reading file contents");
        const data = await handle.readFile("utf8");
        if(!isValidJSON(data)){
            console.log("[WARN] Settings file was broken. Recreating the file")
            await createSettingsFile();
            handle.close();
            return DEFAULT_USER_SETTINGS;
        }
        else{
            const json = JSON.parse(data);
            const prefs = buildUserSettings(json);
            handle.close();
            return prefs;
        }
    }
    catch (err) {
        console.log("[CRITICAL] Something bad happened while reading user settings.")
        if(isNodeError(err)) console.log(err.message);
        return null;
    }
}

export async function writeUserPrefs(prefs: UserSettings){
    try {
        await writeFile(filename, JSON.stringify(prefs));
    } catch (err) {
        console.log("[CRITICAL] Something bad happened while saving user settings.")
        if(isNodeError(err)) console.log(err.message);
    }
}