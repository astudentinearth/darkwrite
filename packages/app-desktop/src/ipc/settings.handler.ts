import { ISettingsService } from "@/service/settings.service";
import { handler, HandlerImplements } from "@/types";
import { DarkwriteUserSettings, ISettingsAPI } from "@darkwrite/common";
import { ok } from "neverthrow";

export function SettingsAPI(
  settingsService: ISettingsService,
): HandlerImplements<ISettingsAPI> {
  const getUserSettings = handler(() => ok(settingsService.getSettings()));
  const saveUserSettings = handler((settings: DarkwriteUserSettings) =>
    settingsService.setSettings(settings).orElse(() => ok()),
  );

  return {
    getUserSettings,
    saveUserSettings,
  };
}
