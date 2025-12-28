import { OS } from "./os";

export interface UpdateServerResponse {
  latest: string;
  release_page: string;
}

export interface DarkwriteDesktopClientInfo {
  version: string;
  isPackaged: boolean;
  os: OS;
  nodeVersion: string;
  electronVersion: string;
}
