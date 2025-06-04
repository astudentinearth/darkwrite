import { FlexibleSpacer } from "@renderer/components/spacer";
import { Button, Label } from "@darkwrite/ui";
import {
  produceUserSettings,
  useSettingsStore,
} from "@renderer/context/settings-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";

declare global {
  interface Window {
    fontAPI: {
      getSystemFonts: () => Promise<string[]>;
    };
  }
}

export default function FontSettings() {
  const { t } = useTranslation(undefined, { keyPrefix: "settings.fonts" });
  const fonts = useSettingsStore((s) => s.settings.fonts);
  const [systemFonts, setSystemFonts] = useState<string[]>([]);
  const [uiFont, setUiFont] = useState<string>(fonts.ui);
  const [sansFont, setSansFont] = useState<string>(fonts.sans);
  const [serifFont, setSerifFont] = useState<string>(fonts.serif);
  const [codeFont, setCodeFont] = useState<string>(fonts.code);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fonts = await window.fontAPI.getSystemFonts();
        setSystemFonts(fonts);
      } catch (error) {
        // Silent fail - the UI will still work with empty system fonts list
        console.error('Failed to load system fonts:', error);
      }
    };
    loadFonts();
  }, []);

  const submit = () => {
    produceUserSettings((draft) => {
      draft.fonts.ui = uiFont;
      draft.fonts.sans = sansFont;
      draft.fonts.serif = serifFont;
      draft.fonts.code = codeFont;
    });
  };

  return (
    <div
      className="p-4 bg-view-2 rounded-2xl flex flex-col gap-4 border border-border/50"
      onKeyDown={(e) => {
        if (e.key === "Enter") submit();
      }}
    >
      <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
      <div className="flex flex-row gap-2 justify-items-center">
        <Label
          htmlFor="ui-font-select"
          className="shrink-0 align-middle flex items-center"
        >
          {t("uiText")}
        </Label>
        <FlexibleSpacer />
        <Select
          value={uiFont}
          onValueChange={setUiFont}
        >
          <SelectTrigger className="w-80" id="ui-font-select">
            <SelectValue placeholder={t("systemDefault")} />
          </SelectTrigger>
          <SelectContent>
            {systemFonts.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-2">
        <Label
          htmlFor="sans-font-select"
          className="shrink-0 flex items-center"
        >
          {t("sansText")}
        </Label>
        <FlexibleSpacer />
        <Select
          value={sansFont}
          onValueChange={setSansFont}
        >
          <SelectTrigger className="w-80" id="sans-font-select">
            <SelectValue placeholder={t("systemDefault")} />
          </SelectTrigger>
          <SelectContent>
            {systemFonts.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-2">
        <Label
          htmlFor="serif-font-select"
          className="shrink-0 flex items-center"
        >
          {t("serifText")}
        </Label>
        <FlexibleSpacer />
        <Select
          value={serifFont}
          onValueChange={setSerifFont}
        >
          <SelectTrigger className="w-80" id="serif-font-select">
            <SelectValue placeholder={t("systemDefault")} />
          </SelectTrigger>
          <SelectContent>
            {systemFonts.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-2">
        <Label
          htmlFor="mono-font-select"
          className="shrink-0 flex items-center"
        >
          {t("monoText")}
        </Label>
        <FlexibleSpacer />
        <Select
          value={codeFont}
          onValueChange={setCodeFont}
        >
          <SelectTrigger className="w-80" id="mono-font-select">
            <SelectValue placeholder={t("systemDefault")} />
          </SelectTrigger>
          <SelectContent>
            {systemFonts.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-2">
        <FlexibleSpacer />
        <Button onClick={submit}>{t("applyButton")}</Button>
      </div>
    </div>
  );
}
