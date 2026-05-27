import { OS } from "@darkwrite/common";
import { DarkwriteAPIClient } from "@/api/api-client";

let os: OS = OS.WINDOWS;

export function initalizePlatform() {
  return DarkwriteAPIClient.desktop.getClientInfo().map((info) => {
    os = info.os;
  });
}

export function getOperatingSystem() {
  return os;
}
