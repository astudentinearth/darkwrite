import { OS } from "@/common/os";

let os: OS = OS.WINDOWS;

export async function initalizePlatform() {
  if (window.isElectron) {
    os = (await window.api.desktop.getClientInfo()).os;
  } else {
    //TODO: Implement user agent based detection
  }
}

export function getOperatingSystem() {
  return os;
}
