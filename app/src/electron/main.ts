import { app } from "electron";
import "reflect-metadata";
import { init } from "./init";

console.log("Start electron app");
app.whenReady().then(() => init());
