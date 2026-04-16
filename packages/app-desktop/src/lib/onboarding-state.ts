import { Paths } from "./paths";
import fse from "fs-extra";

export const CURRENT_VERSION = "v1";

export async function isNewUser() {
  return !(await fse.pathExists(Paths.ONBOARD_FLAG_PATH));
}

export async function markOnboardingCompleted() {
  await fse.writeFile(Paths.ONBOARD_FLAG_PATH, "onboarded");
}

export async function hasMigratedToVersion(version: string) {
  try {
    const current = await fse.readFile(Paths.VERSION_FLAG_PATH, "utf-8");
    return current.trim() === version;
  } catch {
    return false;
  }
}

export async function markVersionMigrated(version: string) {
  await fse.writeFile(Paths.VERSION_FLAG_PATH, version);
}
