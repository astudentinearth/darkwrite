import path from "node:path";
import { readFile } from "fs/promises";
import chalk from "chalk";

export const DESKTOP_PACKAGE_JSON_PATH = path.resolve( "packages/app-desktop/package.json" );

export async function getDesktopPackageInfo() {
  console.log(chalk.gray("Reading desktop package.json"));
  const packageJsonPath = path.join(DESKTOP_PACKAGE_JSON_PATH);
  const packageJsonContents =await readFile(packageJsonPath, "utf-8");
  const packageJSON = JSON.parse(packageJsonContents);

  const version = packageJSON.version;

  return {version}
}

