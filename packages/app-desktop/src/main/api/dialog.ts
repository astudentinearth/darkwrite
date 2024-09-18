import { dialog } from "electron"

export type SaveFileDialogOptions = {
    title?: string,
    defaultPath?: string,
    buttonLabel: string,

}

export type SaveFileDialogReturnType = {
    canceled: boolean,
    path?: string
}

/**
 * Shows a native save file dialog
 */
export async function saveFile(opts: SaveFileDialogOptions){
    const result = await dialog.showSaveDialog(opts);
    const {canceled, filePath} = result;
    return {canceled, path:filePath} as SaveFileDialogReturnType;
}