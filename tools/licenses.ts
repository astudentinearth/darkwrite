import path from "node:path";
import fs from "fs/promises";
import chalk from "chalk";

const COMMON_LICENSE_PATH = path.resolve(
  "packages/common/dist/thirdparty.common.md",
);
const FRONTEND_LICENSE_PATH = path.resolve(
  "packages/frontend/dist/thirdparty.frontend.md",
);
const MAIN_LICENSE_PATH = path.resolve(
  "packages/app-desktop/dist-electron/thirdparty.main.md",
);
const PRELOAD_LICENSE_PATH = path.resolve(
  "packages/app-desktop/dist-electron/thirdparty.preload.md",
);
export const OUTPUT_LICENSE_PATH = path.resolve(
  "packages/app-desktop/THIRDPARTY.md",
);
/**
 * Collects the license reports from dist directories of each package and concatenates them into a single file in the root of the project.
 * */
export async function collectPackageLicenses() {
  let output = "";
  const licensePaths = [
    COMMON_LICENSE_PATH,
    FRONTEND_LICENSE_PATH,
    MAIN_LICENSE_PATH,
    PRELOAD_LICENSE_PATH,
  ];
  console.log(chalk.gray("Generating third party licenses file"));
  for (const licensePath of licensePaths) {
    try {
      const content = await fs.readFile(licensePath, "utf-8");
      output += `## ${path.basename(licensePath)}\n\n`;
      output += content + "\n\n";
    } catch (error) {
      console.warn(
        chalk.yellow(`Could not read license file at ${licensePath}: ${error}`),
      );
    }
  }
  await fs.writeFile(OUTPUT_LICENSE_PATH, output, "utf-8");
}
