import {
  type CheckUpdateFn,
  type DarkwriteIPCBridge,
  hydrateResultAsync,
  type IBackupAPI,
  type IDatabaseAPI,
  type IDesktopAPI,
  type IEmbedAPI,
  type IFileLinkAPI,
  type INoteAPI,
  type IOnboardingAPI,
  type ISettingsAPI,
  type IThemeAPI,
  type IWorkspaceAPI,
} from "@darkwrite/common";
import _ from "lodash";
import { EmbedAdapter } from "./local/embed-local-adapter";

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
  static onboarding: IOnboardingAPI;
  static backup: IBackupAPI;
  static database: IDatabaseAPI;
  static fileLink: IFileLinkAPI;
  static checkUpdate: CheckUpdateFn;

  private static initializeLocalAPIs() {
    const api = resultHydrationMiddleware(window.api);
    console.log(api);
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
    DarkwriteAPIClient.database = api.database;
  }

  static initialize() {
    DarkwriteAPIClient.initializeLocalAPIs();
  }
}
