import { OS } from "@darkwrite/common";

let os: OS = OS.WINDOWS;

export function initalizePlatform() {
  return window.api.desktop.getClientInfo().map((info) => {
    os = info.os;
  });
}

export function getOperatingSystem() {
  return os;
}
