import { FontStyle } from "@darkwrite/common/models";
import { Button, Input } from "@darkwrite/ui";
import {
  setEditorCustomizations,
  useEditorState,
} from "@/context/editor-state";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const setCustomFont = _.debounce((fontName: string) => {
  const style = useEditorState.getState().customizations;
  setEditorCustomizations({ ...style, customFont: fontName });
}, 200);

export default function FontStyleView() {
  const style = useEditorState((state) => state.customizations);
  const setStyle = setEditorCustomizations;
  const customFont = useEditorState((state) => state.customizations.customFont);
  const { t } = useTranslation(undefined, {
    keyPrefix: "editor.customizations",
  });
  // const setCustomFont = (fontName: string) =>
  //     setStyle({ ...style, customFont: fontName });

  return (
    <div className="rounded-lg p-1">
      <div className="grid grid-cols-[80px_80px_80px_80px] [&>button]:rounded-xl [&>button]:w-full [&>button]:h-[80px]">
        <Button
          variant={"ghost"}
          onClick={() => setStyle({ ...style, font: FontStyle.SANS })}
          className={cn(
            (style.font === "sans" || style.font == null) &&
              "text-primary hover:text-primary/80",
          )}
        >
          <div className="[&>span]:block">
            <span className="darkwrite-sans text-3xl">Aa</span>
            <span>{t("sansText")}</span>
          </div>
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => setStyle({ ...style, font: FontStyle.SERIF })}
          className={cn(
            style.font === "serif" && "text-primary hover:text-primary/80",
          )}
        >
          <div className="[&>span]:block">
            <span className="darkwrite-serif text-3xl">Aa</span>
            <span>{t("serifText")}</span>
          </div>
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => setStyle({ ...style, font: FontStyle.MONO })}
          className={cn(
            style.font === "mono" && "text-primary hover:text-primary/80",
          )}
        >
          <div className="[&>span]:block">
            <span className="darkwrite-mono text-3xl">Aa</span>
            <span>{t("monoText")}</span>
          </div>
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => setStyle({ ...style, font: FontStyle.CUSTOM })}
          className={cn(
            style.font === "custom" && "text-primary hover:text-primary/80",
          )}
        >
          <div className="[&>span]:block">
            <span className="font-sans text-3xl">A?</span>
            <span>{t("customText")}</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            "flex items-center gap-2 pt-2",
            style.font !== "custom" && "hidden",
          )}
        >
          <Input
            defaultValue={customFont}
            onChange={(e) => {
              setCustomFont(e.target.value);
            }}
            className="bg-view-2"
            id="customFont"
            placeholder={t("customFontNamePlaceholer")}
          />
        </div>
      </div>
    </div>
  );
}
