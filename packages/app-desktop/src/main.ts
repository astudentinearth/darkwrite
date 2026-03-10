import { app } from "electron";
import "reflect-metadata";
import { init } from "./init";

const lock = app.requestSingleInstanceLock();

if (!lock) {
  app.quit();
} else {
  app.whenReady().then(() => init());
}
