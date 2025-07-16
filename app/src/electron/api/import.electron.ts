import { FileImportResult, MarkdownConverter } from "@darkwrite/common";
import { openFile } from "./dialog";
import path from "node:path";
import fse from "fs-extra";

const ImportFilters: Electron.FileFilter[] = [
  { name: "Text Documents", extensions: ["htm", "html", "md", "txt"] },
  { name: "All Files", extensions: ["*"] },
];

export const ImportAPI = {
  async importFile(): Promise<FileImportResult | null> {
    const dialogResult = await openFile({
      buttonLabel: "Import",
      filters: ImportFilters,
      properties: ["dontAddToRecent"],
    });

    if (dialogResult.canceled) return null;

    const fileResult = dialogResult.filePaths;
    const filePath = fileResult.at(0);
    if (!filePath) return null;

    const ext = path.extname(filePath);
    const contents = await fse.readFile(filePath, { encoding: "utf-8" });

    switch (ext) {
      case ".md": {
        const html = MarkdownConverter.convertMarkdownToHTML(contents);
        return { content: html, type: "html" };
      }
      case ".html": {
        return { content: contents, type: "html" };
      }
      case ".txt": {
        return { content: contents, type: "text" };
      }
      default: {
        return { content: contents, type: "text" };
      }
    }
  },
};
