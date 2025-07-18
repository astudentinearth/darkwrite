import http from "node:http";
import { app, ipcMain } from "electron";
import { recursiveKeys } from "@/common/object";
import { buildPreloadObject, DarkwriteElectronAPI } from "../ipc/api";
import { is } from "@electron-toolkit/utils";

let server: http.Server;

function getRuntimeInfo() {
  const ipcChannels = recursiveKeys(buildPreloadObject());
  const electronVersion = process.versions.electron;
  const nodeVersion = process.versions.node;
  const isDev = is.dev;
  const { commandLine, isPackaged } = app;
  const metrics = app.getAppMetrics();
  return {
    ipcChannels,
    electronVersion,
    nodeVersion,
    commandLine,
    isPackaged,
    isDev,
    metrics
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
