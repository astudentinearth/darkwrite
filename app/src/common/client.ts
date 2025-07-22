
export interface UpdateServerResponse {
  latest: string,
  release_page: string
}

export interface DarkwriteDesktopClientInfo {
  version: string;
  isPackaged: boolean;
  os: string;
  nodeVersion: string;
  electronVersion: string;
}