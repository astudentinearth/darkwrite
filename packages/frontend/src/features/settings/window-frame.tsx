import { useTranslation } from "react-i18next";
import { SwitchablePreference } from "./components/switchable";
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
      <SwitchablePreference
        value={settings.appearance.useSystemWindowFrame}
        onValueChange={toggleUseSystemWindowFrame}
        title={t("settings.appearance.useSystemWindowFrame")}
      />
    </div>
  );
}
