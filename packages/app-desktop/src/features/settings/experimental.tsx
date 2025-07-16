import { FlexibleSpacer } from "@/components/spacer";
import { Label } from "@/components/ui/label";
import { Switch } from "@darkwrite/ui";
import {
  updateUserSettings,
  useSettingsStore,
} from "@/context/settings-store";
import { useClientInfo } from "@/hooks/query";
import { produce } from "immer";
import { useTranslation } from "react-i18next";

export default function ExperimentalFeatures() {
  const { t } = useTranslation(undefined, {
    keyPrefix: "settings.experimental",
  });
  const darwinTitlebar = useSettingsStore(
    (s) => s.settings.appearance.enableCustomWindowFrameOnDarwin,
  );
  const setDarwinTitlebar = (val: boolean) =>
    updateUserSettings((old) =>
      produce(old, (draft) => {
        draft.appearance.enableCustomWindowFrameOnDarwin = val;
      }),
    );
  const info = useClientInfo();
  return (
    <div className="p-4 bg-view-2 rounded-2xl flex flex-col gap-4 border border-border/50">
      <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
      <div className="flex flex-row items-center">
        <Label htmlFor="enable-titlebar-on-macos">
          {t("enableCustomTitlebarOnMac")}
        </Label>
        <FlexibleSpacer />
        <Switch
          disabled={!info?.os?.startsWith("Darwin")}
          id="enable-titlebar-on-macos"
          checked={darwinTitlebar}
          onCheckedChange={setDarwinTitlebar}
        />
      </div>
    </div>
  );
}
