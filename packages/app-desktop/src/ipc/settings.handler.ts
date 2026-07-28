import type { DarkwriteUserSettings, ISettingsAPI } from "@darkwrite/common";
import { ok } from "neverthrow";
import type { ISettingsService } from "@/service/settings.service";
import { type HandlerImplements, handler } from "@/types";

export function SettingsAPI(
  settingsService: ISettingsService,
  onSettingsSaved?: (settings: DarkwriteUserSettings) => void,
): HandlerImplements<ISettingsAPI> {
  const getUserSettings = handler(() => ok(settingsService.getSettings()));
  const saveUserSettings = handler((settings: DarkwriteUserSettings) =>
    settingsService
      .setSettings(settings)
      .andTee(() => onSettingsSaved?.(settings))
      .orElse(() => ok()),
  );

  return {
    getUserSettings,
    saveUserSettings,
  };
}
