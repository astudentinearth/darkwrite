import { useTranslation } from "react-i18next";
import { Label, Switch } from "@/components/ui";
import { useSettings } from "./hooks/use-settings";
import { useSettingsActions } from "./store/settings-actions";

export function WindowFrameSettings() {
  const { t } = useTranslation("translation");
  const { updateSettings } = useSettingsActions();
  const settings = useSettings();

  const toggleUseSystemWindowFrame = (value: boolean) => {
    updateSettings({ appearance: { useSystemWindowFrame: value } });
  };

  return (
    <div className="flex flex-col bg-view-2 top-highlight rounded-lg p-4 w-160 gap-4 drop-shadow-sm">
      <div className="flex items-center justify-between">
        <Label htmlFor="switch-use-system-window-frame">
          {t("settings.appearance.useSystemWindowFrame")}
        </Label>
        <Switch
          id="switch-use-system-window-frame"
          checked={settings.appearance.useSystemWindowFrame}
          onCheckedChange={toggleUseSystemWindowFrame}
        />
      </div>
    </div>
  );
}
