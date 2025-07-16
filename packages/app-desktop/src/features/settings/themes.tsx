import { Button, Label } from "@darkwrite/ui";
import { ColorPicker } from "@/components/color-picker";
import { FlexibleSpacer } from "@/components/spacer";
import {
  produceUserSettings,
  useSettingsStore,
} from "@/context/settings-store";
import { useImportThemeMutation } from "@/hooks/query";
import { FolderClosed } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeMenu } from "./theme-menu";
import { DesktopThemeOptions } from "./themes.desktop";

export function ThemeSettings() {
  const accentColor = useSettingsStore(
    (state) => state.settings.appearance.accentColor,
  );

  const useSystemAccentColor = useSettingsStore(
    (s) => s.settings.appearance.useSystemAccentColor,
  );
  const setAccentColor = (val: string) => {
    produceUserSettings((draft) => {
      draft.appearance.accentColor = val;
    });
  };
  const importMutation = useImportThemeMutation();
  const { t } = useTranslation(undefined, { keyPrefix: "settings.appearance" });
  return (
    <div className="p-4 rounded-2xl flex bg-view-2 flex-col gap-4 border border-border/50">
      <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
      <div className="flex items-center">
        <Label>{t("colorThemeText")}</Label>
        <FlexibleSpacer />
        <div className="flex items-center gap-2">
          <ThemeMenu />

          <Button
            title={t("importTooltip")}
            variant={"secondary"}
            className="w-10 h-10 p-0 shrink-0 border border-border"
            onClick={() => importMutation.mutateAsync()}
          >
            <FolderClosed size={18} />
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <Label>{t("accentColorText")}</Label>
        <FlexibleSpacer />
        <ColorPicker
          disabled={useSystemAccentColor}
          value={accentColor}
          onChange={setAccentColor}
        />
      </div>
      {window.isElectron && <DesktopThemeOptions/>}
    </div>
  );
}
