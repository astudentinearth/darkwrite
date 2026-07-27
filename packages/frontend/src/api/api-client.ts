import {
  type CheckUpdateFn,
  type DarkwriteIPCBridge,
  hydrateResultAsync,
  type IDesktopAPI,
  type IEmbedAPI,
  type IFileLinkAPI,
  type INoteAPI,
  type ISettingsAPI,
  type IThemeAPI,
  type IWorkspaceAPI,
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

// biome-ignore lint/complexity/noStaticOnlyClass: we want this as a namespace
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
    DarkwriteAPIClient.note = api.note;
    DarkwriteAPIClient.workspace = api.workspace;
    DarkwriteAPIClient.settings = api.settings;
    DarkwriteAPIClient.embed = EmbedAdapter(api.embed);
    DarkwriteAPIClient.theme = api.theme;
    DarkwriteAPIClient.desktop = api.desktop;
    DarkwriteAPIClient.onboarding = api.onboarding;
    DarkwriteAPIClient.backup = api.backup;
    DarkwriteAPIClient.fileLink = api.fileLink;
    DarkwriteAPIClient.checkUpdate = api.checkUpdate;
  }

  private static initializeCloudAPIs() {
    //TODO: cloud support not implemented yet
    DarkwriteAPIClient.initializeLocalAPIs();
  }

  static initialize(mode: APIClientMode) {
    if (mode === APIClientMode.LOCAL) DarkwriteAPIClient.initializeLocalAPIs();
    else if (mode === APIClientMode.CLOUD)
      DarkwriteAPIClient.initializeCloudAPIs();
  }
}
