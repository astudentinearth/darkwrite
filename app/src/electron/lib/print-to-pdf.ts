import { BrowserWindow } from "electron";
import log from "electron-log";

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
    const htmlBuffer = Buffer.from(html, "utf-8");
    await win.loadURL(
      `data:text/html;charset=utf-8;base64,${htmlBuffer.toString("base64")}`,
    );
    win.setTitle(title ?? "Document");
    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: "A4",
      margins: { top: 0.8, left: 0.6, right: 0.6, bottom: 0.8 },
    });
    return pdfBuffer;
  } catch (err) {
    log.error("Failed to print to PDF:", err);
  } finally {
    win.close();
  }
}
