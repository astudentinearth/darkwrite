import { Paths } from "./paths";
import fse from "fs-extra";

export async function hasOnboarded() {
  return fse.pathExists(Paths.ONBOARD_FLAG_PATH);
}

export async function hasMigratedToVersion(version: string) {
  try {
    const currentVersion = await fse.readFile(Paths.VERSION_FLAG_PATH, "utf-8");
    return currentVersion.trim() === version;
  } catch {
    return false;
  }
}

export async function isAlphaMigrationPerformed() {
  return fse.pathExists(Paths.SESSION_DATA_DIR);
}

export async function markOnboardingCompleted() {
  await fse.writeFile(Paths.ONBOARD_FLAG_PATH, "onboarded");
}

export async function markVersionMigrated(version: string) {
  await fse.writeFile(Paths.VERSION_FLAG_PATH, version);
}
