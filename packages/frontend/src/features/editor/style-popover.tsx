import { FontStyle, type NoteCustomization } from "@darkwrite/common";
import { Brush, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import FontSelect from "@/components/font-select";
import { HeaderbarButton } from "@/components/headerbar-button";
import { Switch } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppSelector } from "../store/hooks";
import { selectEditorCustomizations } from "./store/editor-selectors";
import useStylePopover from "./use-style-popover";

export default function StylePopover({ id }: { id: string }) {
  const customizations = useAppSelector((s) =>
    selectEditorCustomizations(s, id ?? ""),
  );
  const { t } = useTranslation();
  if (!id || !customizations) return;
  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger>
            <HeaderbarButton>
              <Brush size={20} />
            </HeaderbarButton>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent>{t("editor.customizations.tooltip")}</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-fit h-fit p-2 mr-2 bg-view-2/80 top-highlight">
        <StyleUI customizations={customizations} noteId={id} />
      </PopoverContent>
    </Popover>
  );
}

export function StyleUI(props: {
  customizations: NoteCustomization;
  noteId: string;
}) {
  const { backgroundColor, customFont, font, textColor, widePage } =
    props.customizations;
  const { t } = useTranslation("translation", {
    keyPrefix: "editor.customizations",
  });
  const { setFont, setColor, setWide } = useStylePopover();
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-1 grid-cols-[1fr_1fr_1fr_1fr] grid-rows-1  [&>button]:h-fit [&>button]:flex [&>button]:flex-col [&>button]:gap-1 [&>button]:rounded-xl [&>button]:w-20">
        <Button
          onClick={() => setFont(FontStyle.SANS)}
          variant={"ghost"}
          className={cn(
            (font === FontStyle.SANS || !font) &&
              "text-primary-text hover:text-primary-text",
          )}
        >
          <span
            style={{ fontFamily: "var(--darkwrite-sans) !important" }}
            className="text-3xl"
          >
            Aa
          </span>
          <span>{t("sansText")}</span>
        </Button>
        <Button
          onClick={() => setFont(FontStyle.SERIF)}
          variant={"ghost"}
          className={cn(
            font === FontStyle.SERIF &&
              "text-primary-text hover:text-primary-text",
          )}
        >
          <span
            style={{ fontFamily: "var(--darkwrite-serif) !important" }}
            className="text-3xl"
          >
            Aa
          </span>
          <span>{t("serifText")}</span>
        </Button>
        <Button
          onClick={() => setFont(FontStyle.MONO)}
          variant={"ghost"}
          className={cn(
            font === FontStyle.MONO &&
              "text-primary-text hover:text-primary-text",
          )}
        >
          <span className="darkwrite-mono text-3xl">Aa</span>
          <span>{t("monoText")}</span>
        </Button>
        <Button
          onClick={() => setFont(FontStyle.CUSTOM)}
          variant={"ghost"}
          className={cn(
            font === FontStyle.CUSTOM &&
              "text-primary-text hover:text-primary-text",
          )}
        >
          <span className="text-3xl">A?</span>
          <span>{t("customText")}</span>
        </Button>
      </div>
      {font === FontStyle.CUSTOM && (
        <FontSelect
          className="w-full max-w-full"
          value={customFont}
          onValueChange={(val) => setFont(FontStyle.CUSTOM, val)}
        />
      )}
      <div className="w-full flex items-center justify-between">
        <label className="pl-2">{t("backgroundColorText")}</label>
        <div className="flex items-center gap-1">
          <ColorPicker
            value={backgroundColor ?? undefined}
            onChange={(val) => setColor("backgroundColor", val)}
          />
          <Button
            className="w-8 h-8 p-0"
            onClick={() => setColor("backgroundColor", null)}
            variant={"outline"}
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <label className="pl-2">{t("foregroundColorText")}</label>
        <div className="flex items-center gap-1">
          <ColorPicker
            value={textColor ?? undefined}
            onChange={(val) => setColor("textColor", val)}
          />
          <Button
            className="w-8 h-8 p-0"
            onClick={() => setColor("textColor", null)}
            variant={"outline"}
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>
      <hr className="opacity-50 mt-2" />
      <div
        onClick={() => setWide(!widePage)}
        className="w-full flex items-center justify-between hover:bg-secondary/20 p-2 rounded-lg"
        tabIndex={0}
      >
        <label className="">{t("widePage")}</label>
        <Switch checked={widePage} onCheckedChange={setWide} />
      </div>
    </div>
  );
}
