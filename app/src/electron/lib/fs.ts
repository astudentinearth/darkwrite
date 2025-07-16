import fse from "fs-extra";

export async function rmIfExists(path: string) {
  if (await fse.pathExists(path)) {
    await fse.rm(path, {
      recursive: true,
      force: true,
    });
  }
}
