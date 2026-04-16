/** Same definition as Electron.WebUtils, included to avoid
 * dependency on Electron in the common package */
export type ElectronWebUtils = {
  getPathForFile: (file: File) => string;
};
