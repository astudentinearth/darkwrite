import FontSelect from "@/components/font-select";
import { useTranslation } from "react-i18next";
import { useFontSettings } from "./hooks/use-settings";
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
    <div className="flex flex-col bg-view-2 top-highlight rounded-lg p-4 w-160 gap-4 drop-shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("uiText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={ui}
          systemDefault="system-ui"
          onValueChange={(val) => setFont("ui", val)}
        />
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("sansText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={sans}
          systemDefault="system-ui"
          onValueChange={(val) => setFont("sans", val)}
        />
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("serifText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={serif}
          systemDefault="ui-serif"
          onValueChange={(val) => setFont("serif", val)}
        />
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("monoText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={code}
          systemDefault="ui-monospace"
          onValueChange={(val) => setFont("code", val)}
        />
      </div>
    </div>
  );
}
