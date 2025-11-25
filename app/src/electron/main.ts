import { app } from "electron";
import "reflect-metadata";
import { init } from "./init";
import log from "electron-log";

Object.assign(console, log.functions);
log.transports.file.level = "info";

app.whenReady().then(() => init());
