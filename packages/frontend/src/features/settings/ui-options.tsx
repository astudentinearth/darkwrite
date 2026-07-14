import { useTranslation } from "react-i18next";
import { SwitchablePreference } from "./components/switchable";
import { useAppearanceSettings } from "./hooks/use-settings";
import SettingsCard from "./settings-card";
import { useSettingsActions } from "./store/settings-actions";

export const UIOptions = () => {
  const settings = useAppearanceSettings();
  const { updateSettings } = useSettingsActions();
  const { t } = useTranslation();

  return (
    <SettingsCard>
      <SwitchablePreference
        title={t("settings.appearance.compactSidebar")}
        description={t("settings.appearance.compactSidebarDescription")}
        value={settings.compactSidebar}
        onValueChange={(val) =>
          updateSettings({ appearance: { compactSidebar: val } })
        }
      />
    </SettingsCard>
  );
};
