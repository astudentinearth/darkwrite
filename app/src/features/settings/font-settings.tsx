import FontSelect from "@/components/font-select";
import { useSettings, useUpdateSettings } from "@/query/use-settings";
import { produce } from "immer";
import { useTranslation } from "react-i18next";

export default function FontSettings() {
  const settings = useSettings().data;
  const mutation = useUpdateSettings();
  const { code, sans, serif, ui } = settings.appearance.fonts;
  const { t } = useTranslation("translation", { keyPrefix: "settings.fonts" });
  const setFont = (type: "ui" | "code" | "sans" | "serif", value: string) => {
    const updated = produce(settings, (draft) => {
      draft.appearance.fonts[type] = value;
    });
    mutation.mutate(updated);
  };
  return (
    <div className="flex flex-col bg-view-2 rounded-lg p-4 w-160 gap-4 drop-shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("uiText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={ui}
          onValueChange={(val) => setFont("ui", val)}
        />
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("sansText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={sans}
          onValueChange={(val) => setFont("sans", val)}
        />
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("serifText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={serif}
          onValueChange={(val) => setFont("serif", val)}
        />
      </div>

      <hr />
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("monoText")}</span>
        <FontSelect
          className="bg-view-1/50"
          value={code}
          onValueChange={(val) => setFont("code", val)}
        />
      </div>
    </div>
  );
}
