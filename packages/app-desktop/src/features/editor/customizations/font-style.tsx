import { Button } from "@darkwrite/ui";
import {
  setEditorCustomizations,
  useEditorState,
} from "@renderer/context/editor-state";
import { cn } from "@renderer/lib/utils";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
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

const setCustomFont = _.debounce((fontName: string) => {
  const style = useEditorState.getState().customizations;
  setEditorCustomizations({ ...style, customFont: fontName });
}, 200);

export default function FontStyleView() {
  const style = useEditorState((state) => state.customizations);
  const setStyle = setEditorCustomizations;
  const customFont = useEditorState((state) => state.customizations.customFont);
  const [systemFonts, setSystemFonts] = useState<string[]>([]);
  const { t } = useTranslation(undefined, {
    keyPrefix: "editor.customizations",
  });

  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fonts = await window.fontAPI.getSystemFonts();
        setSystemFonts(fonts);
      } catch (error) {
        console.error('Error loading system fonts:', error);
      }
    };
    loadFonts();
  }, []);

  return (
    <div className="rounded-lg p-1">
      <div className="grid grid-cols-[80px_80px_80px_80px] [&>button]:rounded-xl [&>button]:w-full [&>button]:h-[80px]">
        <Button
          variant={"ghost"}
          onClick={() => setStyle({ ...style, font: "sans" })}
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
          onClick={() => setStyle({ ...style, font: "serif" })}
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
          onClick={() => setStyle({ ...style, font: "mono" })}
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
          onClick={() => setStyle({ ...style, font: "custom" })}
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
          <Select
            value={customFont}
            onValueChange={setCustomFont}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a font..." />
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
      </div>
    </div>
  );
}
