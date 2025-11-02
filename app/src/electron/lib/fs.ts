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

export function checkAccess(_path: string) {
  try {
    fse.accessSync(_path, fse.constants.W_OK);
    return true;
  } catch (_err) {
    return false;
  }
}

export async function dirSize(root: string) {
  let total = 0;
  const files = await fse.readdir(root, { recursive: true, encoding: "utf-8" });
  for (const file of files) {
    const fullPath = path.join(root, file);
    const stats = await fse.lstat(fullPath);
    if (stats.isFile()) {
      total += stats.size;
    }
  }
  return total;
}
