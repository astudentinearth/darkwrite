import { use, useState } from "react";
import { useFormattingState } from "../../hooks/use-formatting-state";
import { DarkwriteEditorContext } from "../../context";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentEditor } from "@tiptap/react";
import {
  ArrowLeftRight,
  ChevronDown,
  PilcrowLeft,
  PilcrowRight,
} from "lucide-react";
import { TextDirection } from "../../types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { BubbleButton } from "./bubble-button";

const icons = {
  [TextDirection.LeftToRight]: <PilcrowRight />,
  [TextDirection.RightToLeft]: <PilcrowLeft />,
  [TextDirection.Auto]: <ArrowLeftRight />,
};

const translations = {
  [TextDirection.LeftToRight]: "ltr",
  [TextDirection.RightToLeft]: "rtl",
  [TextDirection.Auto]: "auto",
} as const;

export function TextDirectionMenu() {
  const { noteId, showTextDirectionControls } = use(DarkwriteEditorContext);
  const { textDirection } = useFormattingState(noteId);
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("translation", {
    keyPrefix: "editor.bubble.textDirection",
  });

  if (!editor) return null;
  if (!showTextDirectionControls) return null;

  const setTextDirection = (direction: TextDirection) => {
    editor.chain().focus().setTextDirection(direction).run();
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger>
            <Button
              variant="ghost"
              className={cn(
                "rounded-lg w-fit gap-1 px-2 text-foreground h-9 active:pushdown-98%",
                open && "bg-secondary/80",
              )}
            >
              {icons[textDirection ?? TextDirection.Auto]}
              <ChevronDown size={16} />
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipPortal container={document.body}>
          <TooltipContent side="bottom" sideOffset={8}>
            {t("label")}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <PopoverContent className="data-[state=closed]:animate-none flex p-1 w-fit gap-1 bg-view-2 top-highlight mt-1">
        {Object.values(TextDirection).map((direction) => (
          <BubbleButton
            key={direction}
            command={() => setTextDirection(direction)}
            isActive={textDirection === direction}
            icon={() => icons[direction]}
            editor={{ editor }}
            name={t(translations[direction])}
            title={t(translations[direction])}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
