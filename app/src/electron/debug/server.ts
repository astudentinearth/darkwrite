import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow } from "electron";
import http from "node:http";

// we could utilize this server to test APIs without a frontend

let server: http.Server;

function getRuntimeInfo() {
  const electronVersion = process.versions.electron;
  const nodeVersion = process.versions.node;
  const isDev = is.dev;
  const { commandLine, isPackaged } = app;
  const metrics = app.getAppMetrics();
  const windows = BrowserWindow.getAllWindows().map(w => ({
    id: w.id,
    pageTitle: w.getTitle(),
    title: w.title,
    url: w.webContents.getURL(),
    userAgent: w.webContents.userAgent
  }));
  return {
    electronVersion,
    nodeVersion,
    commandLine,
    isPackaged,
    isDev,
    metrics,
    windows,
  };
}


function devtoolsHandler(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) {
  switch (req.url) {
    case "/": {
      const info = getRuntimeInfo();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(info));
    }
    default: {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  }
}

export function initDevtools(port: number) {
  console.log(`[DEV] Starting devtools server...`);
  server = http.createServer((req, res) => {
    console.log(`[DEV] Handling devtools request: ${req.url}`);
    try {devtoolsHandler(req, res)}
    catch {/* empty */}
  });
  server.listen(port, () => {
    console.log(`[DEV] Started devtools at http://localhost:${port}`);
  });
}
