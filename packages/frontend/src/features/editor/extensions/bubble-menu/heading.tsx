import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCurrentEditor } from "@tiptap/react";
import {
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditorUtil from "../../editor-util";
import type { HeadingLevel } from "../../types";

const headingIcons: Record<HeadingLevel, ReactNode> = {
  1: <Heading1 />,
  2: <Heading2 />,
  3: <Heading3 />,
  4: <Heading4 />,
};

export function HeadingSelector() {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation(undefined, { keyPrefix: "editor.bubble" });

  const [open, setOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState<HeadingLevel | null>(null);

  const updateActiveHeading = useCallback(() => {
    if (!editor) return;
    setActiveHeading(EditorUtil(editor).getActiveHeading());
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", updateActiveHeading);
    editor.on("update", updateActiveHeading);
    return () => {
      editor.off("selectionUpdate", updateActiveHeading);
      editor.off("update", updateActiveHeading);
    };
  }, [editor, updateActiveHeading]);

  const icon = activeHeading ? headingIcons[activeHeading] : <Heading1 />;
  const item = useCallback(
    (icon: ReactNode, text: string, callback: () => void) => {
      return (
        <Button
          variant={"ghost"}
          className="px-1 pr-2 py-0 justify-start"
          onClick={() => {
            setOpen(false);
            callback();
          }}
        >
          <div className="flex gap-2 items-center">
            <div className="p-1 border-border border bg-secondary/25 rounded-md">
              {icon}
            </div>
            <span>{text}</span>
          </div>
        </Button>
      );
    },
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-lg w-fit gap-1 px-2 text-foreground h-9 active:pushdown-98%",
            open && "bg-secondary/80",
          )}
        >
          {icon}
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 flex flex-col w-fit rounded-xl bg-view-2 text-foreground data-[state=closed]:animate-none!">
        {item(<Heading1 />, t("h1"), () => {
          editor?.chain().toggleHeading({ level: 1 }).run();
        })}
        {item(<Heading2 />, t("h2"), () => {
          editor?.chain().toggleHeading({ level: 2 }).run();
        })}
        {item(<Heading3 />, t("h3"), () => {
          editor?.chain().toggleHeading({ level: 3 }).run();
        })}
        {item(<Heading4 />, t("h4"), () => {
          editor?.chain().toggleHeading({ level: 4 }).run();
        })}
        {item(<Pilcrow />, t("clearHeading"), () => {
          editor?.chain().focus().setParagraph().run();
        })}
      </PopoverContent>
    </Popover>
  );
}
