import { FlexibleSpacer } from "@/components/spacer";
import { Button, Input, Label } from "@darkwrite/ui";
import {
  produceUserSettings,
  useSettingsStore,
} from "@/context/settings-store";
import { ChangeEvent, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function FontSettings() {
  const { t } = useTranslation(undefined, { keyPrefix: "settings.fonts" });
  const fonts = useSettingsStore((s) => s.settings.fonts);
  const uiRef = useRef<HTMLInputElement>(null);
  const sansRef = useRef<HTMLInputElement>(null);
  const serifRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const submit = () => {
    produceUserSettings((draft) => {
      if (
        !uiRef.current ||
        !sansRef.current ||
        !serifRef.current ||
        !codeRef.current
      )
        return;

      draft.fonts.ui = uiRef.current.value;
      draft.fonts.sans = sansRef.current.value;
      draft.fonts.serif = serifRef.current.value;
      draft.fonts.code = codeRef.current.value;
    });
  };

  const handlePreview = (
    e: ChangeEvent<HTMLInputElement>,
    fallback: string,
  ) => {
    e.target.style.setProperty("font-family", `${e.target.value}, ${fallback}`);
  };

  return (
    <div
      className="p-4 bg-view-2 rounded-2xl flex flex-col gap-4 border border-border/50"
      onKeyDown={(e) => {
        if (e.key == "Enter") submit();
      }}
    >
      <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
      <div className="flex flex-row gap-2 justify-items-center">
        <Label
          htmlFor="ui-font-input"
          className="shrink-0 align-middle flex items-center"
        >
          {t("uiText")}
        </Label>
        <FlexibleSpacer />
        <Input
          id="ui-font-input"
          className="max-w-80"
          defaultValue={fonts.ui}
          ref={uiRef}
          placeholder={t("systemDefault")}
          onChange={(e) => handlePreview(e, fonts.ui)}
          style={{ fontFamily: fonts.ui }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <Label
          htmlFor="sans-font-input"
          className="shrink-0 flex items-center"
        >
          {t("sansText")}
        </Label>
        <FlexibleSpacer />
        <Input
          id="sans-font-input"
          className="max-w-80"
          defaultValue={fonts.sans}
          ref={sansRef}
          onChange={(e) => handlePreview(e, fonts.sans)}
          style={{ fontFamily: fonts.sans }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <Label
          htmlFor="serif-font-input"
          className="shrink-0 flex items-center"
        >
          {t("serifText")}
        </Label>
        <FlexibleSpacer />
        <Input
          id="serif-font-input"
          className="max-w-80"
          defaultValue={fonts.serif}
          ref={serifRef}
          onChange={(e) => handlePreview(e, fonts.serif)}
          style={{ fontFamily: fonts.serif }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <Label
          htmlFor="mono-font-input"
          className="shrink-0 flex items-center"
        >
          {t("monoText")}
        </Label>
        <FlexibleSpacer />
        <Input
          id="mono-font-input"
          className="max-w-80"
          defaultValue={fonts.code}
          ref={codeRef}
          onChange={(e) => handlePreview(e, fonts.code)}
          style={{ fontFamily: fonts.code }}
        />
      </div>
      <div className="flex flex-row gap-2">
        <FlexibleSpacer />
        <Button onClick={submit}>{t("applyButton")}</Button>
      </div>
    </div>
  );
}
