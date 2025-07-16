import { Label, Switch } from "@darkwrite/ui";
import { FlexibleSpacer } from "@/components/spacer";
import {
  updateUserSettings,
  produceUserSettings,
  useSettingsStore,
} from "@/context/settings-store";
import { useClientInfo } from "@/hooks/query";
import { produce } from "immer";
import { useTranslation } from "react-i18next";

export function DesktopThemeOptions() {
  const { t } = useTranslation(undefined, { keyPrefix: "settings.appearance" });
  const info = useClientInfo();
  const useSystemAccentColor = useSettingsStore(
    (s) => s.settings.appearance.useSystemAccentColor,
  );

  const setWindowFrame = (val: boolean) =>
    updateUserSettings((state) =>
      produce(state, (draft) => {
        draft.appearance.useSystemWindowFrame = val;
      }),
    );
  const setSystemAccentColor = (val: boolean) =>
    produceUserSettings((draft) => {
      draft.appearance.useSystemAccentColor = val;
    });
  const useSystemWindowFrame = useSettingsStore(
    (s) => s.settings.appearance.useSystemWindowFrame,
  );
  return (
    <>
      <div className="flex flex-row items-center">
        <div className="flex flex-col">
          <Label htmlFor="use-system-accent-color">
            {t("useSystemAccentColor")}
          </Label>
          <span className="text-foreground/70 text-sm">
            {t("useSystemAccentColorDescription")}
          </span>
        </div>
        <FlexibleSpacer />
        <Switch
          checked={useSystemAccentColor}
          onCheckedChange={setSystemAccentColor}
          id="use-system-accent-color"
          disabled={
            !(info?.os.includes("Windows") || info?.os.includes("Darwin"))
          }
        />
      </div>
      <div className="flex flex-row items-center">
        <Label htmlFor="use-system-window-frame">
          {t("useSystemWindowFrame")}
        </Label>

        <FlexibleSpacer />
        <Switch
          checked={useSystemWindowFrame}
          onCheckedChange={setWindowFrame}
          id="use-system-window-frame"
        />
      </div>
    </>
  );
}
