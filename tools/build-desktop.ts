
import fs from "fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";


/** Copies the frontend bundle into desktop app's directory, so that they can be included in the final Electron package. */
export async function bundleCopy() {
  const frontendDistPath = path.resolve("packages/frontend/dist");
  const desktopDistPath = path.resolve("packages/app-desktop/dist");

  if(existsSync(desktopDistPath)) {
    await fs.rm(desktopDistPath, {recursive: true, force: true});
  }

  await fs.cp(frontendDistPath, desktopDistPath, {recursive: true});
}

