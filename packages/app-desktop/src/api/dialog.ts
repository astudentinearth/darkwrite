import { dialog, OpenDialogOptions } from "electron";

/** @deprecated useless abstraction */
export type SaveFileDialogOptions = {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
};

/** @deprecated useless abstraction */
export type SaveFileDialogReturnType = {
  canceled: boolean;
  path?: string;
};

/**
 * @deprecated useless abstraction
 * Shows a native save file dialog
 */
export async function saveFile(opts: SaveFileDialogOptions) {
  const result = await dialog.showSaveDialog(opts);
  const { canceled, filePath } = result;
  return { canceled, path: filePath } as SaveFileDialogReturnType;
}

/**
 * Shows a native open file dialog
 * @deprecated useless abstraction
 * @param opts dialog options
 */
export async function openFile(opts: OpenDialogOptions) {
  const result = await dialog.showOpenDialog(opts);
  return result;
}
