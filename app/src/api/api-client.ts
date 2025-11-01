import {
  IDesktopAPI,
  IEmbedAPI,
  INoteAPI,
  ISettingsAPI,
  IThemeAPI,
  IWorkspaceAPI,
} from "@/common/contract";
import { EmbedLocalAdapter } from "./local/embed-local-adapter";

export enum APIClientMode {
  LOCAL = "local",
  CLOUD = "cloud",
}

export class DarkwriteAPIClient {
  static note: INoteAPI;
  static embed: IEmbedAPI;
  static workspace: IWorkspaceAPI;
  static settings: ISettingsAPI;
  static theme: IThemeAPI;
  static desktop: IDesktopAPI;
  static onboarding: typeof window.api.onboarding;
  static backup: typeof window.api.backup;

  private static initializeLocalAPIs() {
    this.note = window.api.note;
    this.workspace = window.api.workspace;
    this.settings = window.api.settings;
    this.embed = new EmbedLocalAdapter();
    this.theme = window.api.theme;
    this.desktop = window.api.desktop;
    this.onboarding = window.api.onboarding;
    this.backup = window.api.backup;
  }

  private static initializeCloudAPIs() {
    //TODO: cloud support not implemented yet
    this.initializeLocalAPIs();
  }

  static initialize(mode: APIClientMode) {
    if (mode === APIClientMode.LOCAL) this.initializeLocalAPIs();
    else if (mode === APIClientMode.CLOUD) this.initializeCloudAPIs();
  }
}
