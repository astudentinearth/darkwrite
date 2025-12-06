import { PageMargins } from "@/common/pdf";
import { BrowserWindow } from "electron";
import log from "electron-log";
import { writeFile } from "fs-extra";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Paths } from "./paths";

async function saveTempFile(html: string) {
  const filePath = path.join(Paths.CACHE_DIR, "dw-pdf-export.html");
  await writeFile(filePath, html, "utf-8");
  return pathToFileURL(filePath).href;
}

export default async function printToPdf(html: string, title?: string) {
  const win = new BrowserWindow({
    show: false,
    width: 960,
    height: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    darkTheme: false,
  });

  try {
    const url = await saveTempFile(html);
    await win.loadURL(url);
    win.setTitle(title ?? "Document");
    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
      margins: PageMargins.A4,
    });
    return pdfBuffer;
  } catch (err) {
    log.error("Failed to print to PDF:", err);
  } finally {
    win.close();
  }
}
