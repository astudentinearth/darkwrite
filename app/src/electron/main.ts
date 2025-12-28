import { app } from "electron";
import "reflect-metadata";
import { init } from "./init";


app.whenReady().then(() => init());
