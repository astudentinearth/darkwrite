import {
  CheckUpdateFn,
  DarkwriteIPCBridge,
  hydrateResultAsync,
  IDesktopAPI,
  IEmbedAPI,
  IFileLinkAPI,
  INoteAPI,
  ISettingsAPI,
  IThemeAPI,
  IWorkspaceAPI,
} from "@darkwrite/common";
import _ from "lodash";
import { EmbedAdapter } from "./local/embed-local-adapter";

export enum APIClientMode {
  LOCAL = "local",
  CLOUD = "cloud",
}

function resultHydrationMiddleware(api: typeof window.api) {
  const clone = _.cloneDeepWith(api, (value) => {
    if (_.isFunction(value))
      return (...args: unknown[]) => hydrateResultAsync(value(...args));
    else return undefined;
  });
  return clone as DarkwriteIPCBridge;
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
  static fileLink: IFileLinkAPI;
  static checkUpdate: CheckUpdateFn;

  private static initializeLocalAPIs() {
    const api = resultHydrationMiddleware(window.api);
    this.note = api.note;
    this.workspace = api.workspace;
    this.settings = api.settings;
    this.embed = EmbedAdapter(api.embed);
    this.theme = api.theme;
    this.desktop = api.desktop;
    this.onboarding = api.onboarding;
    this.backup = api.backup;
    this.fileLink = api.fileLink;
    this.checkUpdate = api.checkUpdate;
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
