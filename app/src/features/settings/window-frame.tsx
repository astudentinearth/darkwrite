import { Label, Switch } from "@/components/ui";
import { useSettings, useUpdateSettings } from "@/query/use-settings";
import { produce } from "immer";
import { useTranslation } from "react-i18next";

export function WindowFrameSettings() {
  const { t } = useTranslation("translation");

  const settings = useSettings().data;
  const mutation = useUpdateSettings();

  const toggleUseSystemWindowFrame = (value: boolean) => {
    const updated = produce(settings, (draft) => {
      draft.appearance.useSystemWindowFrame = value;
    });
    mutation.mutate(updated);
  };

  const handleCsdOnDarwin = (value: boolean) => {
    const updated = produce(settings, (draft) => {
      draft.appearance.experimental.darwinCustomTitlebarEnabled = value;
    });
    mutation.mutate(updated);
  };

  return (
    <div className="flex flex-col bg-view-2 rounded-lg p-4 w-160 gap-4 drop-shadow-sm">
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
      <hr />
      <div className="flex items-center justify-between">
        <Label htmlFor="switch-darwin-csd">
          {t("settings.experimental.enableCustomTitlebarOnMac")}
        </Label>
        <Switch
          id="switch-darwin-csd"
          checked={settings.appearance.experimental.darwinCustomTitlebarEnabled}
          onCheckedChange={handleCsdOnDarwin}
        />
      </div>
    </div>
  );
}
