import { FontStyle, NoteCustomization } from "@/common/note-customization";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNoteContent } from "@/query/use-note-content";
import { useNoteFromURL } from "@/query/use-note-from-url";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import useStylePopover from "./use-style-popover";
import FontSelect from "@/components/font-select";
import { ColorPicker } from "@/components/ui/color-picker";
import { RotateCcw } from "lucide-react";

export default function StylePopover({ children }: { children: ReactNode }) {
  const id = useNoteFromURL();
  const query = useNoteContent(id ?? "");
  if (!id) return;
  const data = query.data;
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit h-fit p-2 mr-2">
        {data && <StyleUI customizations={data.customizations} noteId={id} />}
      </PopoverContent>
    </Popover>
  );
}

export function StyleUI(props: {
  customizations: NoteCustomization;
  noteId: string;
}) {
  const {
    backgroundColor,
    coverImageSource,
    customFont,
    font,
    largeText,
    textColor,
    widePage,
  } = props.customizations;
  const { t } = useTranslation("translation", {
    keyPrefix: "editor.customizations",
  });
  const { setFont, setColor } = useStylePopover(props.noteId);
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
          <span
            style={{ fontFamily: "var(--darkwrite-mono) !important" }}
            className="darkwrite-mono! text-3xl"
          >
            Aa
          </span>
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
      {font === FontStyle.CUSTOM && <FontSelect className="w-full" value={customFont} onValueChange={val => setFont(FontStyle.CUSTOM, val)} /> }
      <div className="w-full flex items-center justify-between">
        <label className="pl-2">Background color:</label>
        <div className="flex items-center gap-1">
          <ColorPicker value={backgroundColor} onChange={val => setColor("backgroundColor", val)} />
          <Button className="w-8 h-8 p-0" onClick={()=>setColor("backgroundColor", undefined)} variant={"outline"}><RotateCcw size={18} /></Button>
        </div> 
      </div>

      <div className="w-full flex items-center justify-between">
        <label className="pl-2">Text color:</label>
        <div className="flex items-center gap-1">
          <ColorPicker value={textColor} onChange={val => setColor("textColor", val)} />
          <Button className="w-8 h-8 p-0" onClick={()=>setColor("textColor", undefined)} variant={"outline"}><RotateCcw size={18} /></Button>
        </div> 
      </div>
    </div>
  );
}
