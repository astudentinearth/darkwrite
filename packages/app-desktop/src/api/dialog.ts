import { isTaggedError } from "@darkwrite/common";
import { dialog, OpenDialogOptions, SaveDialogOptions } from "electron";
import { err, ok, Result, ResultAsync } from "neverthrow";

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

export type DialogCancelError = { type: "_internal-dialog-cancelled" };

export function showOpenDialog(options: OpenDialogOptions) {
  return ResultAsync.fromSafePromise(dialog.showOpenDialog(options)).andThen(
    (result) =>
      result.canceled
        ? err({
            type: "_internal-dialog-cancelled",
          } satisfies DialogCancelError)
        : ok(result.filePaths),
  );
}

export function showSaveDialog(options: SaveDialogOptions) {
  return ResultAsync.fromSafePromise(dialog.showSaveDialog(options)).andThen(
    (result) =>
      result.canceled
        ? err({
            type: "_internal-dialog-cancelled",
          } satisfies DialogCancelError)
        : ok(result.filePath),
  );
}

export function whenDialogCancelled<T>(value: T) {
  return <E>(error: E): Result<T, Exclude<E, DialogCancelError>> =>
    ((isTaggedError(error) && error.type) ?? "_internal-dialog-cancelled")
      ? ok(value)
      : err(error as Exclude<E, DialogCancelError>);
}
