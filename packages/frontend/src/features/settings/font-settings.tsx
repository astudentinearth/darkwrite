import { useTranslation } from "react-i18next";
import FontSelect from "@/components/font-select";
import { useFontSettings } from "./hooks/use-settings";
import SettingsCard from "./settings-card";
import { useSettingsActions } from "./store/settings-actions";

export default function FontSettings() {
  const settings = useFontSettings();
  const { code, sans, serif, ui } = settings;
  const { updateSettings } = useSettingsActions();
  const { t } = useTranslation("translation", { keyPrefix: "settings.fonts" });
  const setFont = (type: "ui" | "code" | "sans" | "serif", value: string) => {
    updateSettings({ appearance: { fonts: { [type]: value } } });
  };
  return (
    <SettingsCard>
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("uiText")}</span>
        <FontSelect
          value={ui}
          systemDefault="system-ui"
          onValueChange={(val) => setFont("ui", val)}
        />
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("sansText")}</span>
        <FontSelect
          value={sans}
          systemDefault="system-ui"
          onValueChange={(val) => setFont("sans", val)}
        />
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("serifText")}</span>
        <FontSelect
          value={serif}
          systemDefault="ui-serif"
          onValueChange={(val) => setFont("serif", val)}
        />
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("monoText")}</span>
        <FontSelect
          value={code}
          systemDefault="ui-monospace"
          onValueChange={(val) => setFont("code", val)}
        />
      </div>
    </SettingsCard>
  );
}
