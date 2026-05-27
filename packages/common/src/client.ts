import type { OS } from "./os";

export interface UpdateServerResponse {
  name: string;
  latest: string;
  release_page: string;
  updateAvailable: boolean;
}

export interface DarkwriteDesktopClientInfo {
  version: string;
  isPackaged: boolean;
  os: OS;
  nodeVersion: string;
  electronVersion: string;
}
