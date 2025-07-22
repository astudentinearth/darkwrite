import fse from "fs-extra";
import path from "path";

export async function rmIfExists(path: string) {
  if (await fse.pathExists(path)) {
    await fse.rm(path, {
      recursive: true,
      force: true,
    });
  }
}

export async function getFileInfo(filePath: string) {
  const basename = path.basename(filePath);
  const stats = await fse.stat(filePath);
  const size = stats.size;
  const extension = path.extname(filePath);
  return { basename, size, extension };
}

export async function ls(dir: string) {
  return await fse.readdir(dir);
}
