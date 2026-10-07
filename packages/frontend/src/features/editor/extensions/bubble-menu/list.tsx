import { IconList, IconListCheck, IconListNumbers } from "@tabler/icons-react";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDown, List } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import EditorUtil from "../../editor-util";
import { ListType } from "../../types";

const listIcons: Record<ListType, ReactNode> = {
  [ListType.Bullet]: <IconList />,
  [ListType.Ordered]: <IconListNumbers />,
  [ListType.Task]: <IconListCheck />,
};

export function ListSelector() {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation(undefined, { keyPrefix: "editor.bubble" });

  const [open, setOpen] = useState(false);
  const [activeList, setActiveList] = useState<ListType | null>(null);

  const updateActiveList = useCallback(() => {
    if (!editor) return;
    setActiveList(EditorUtil(editor).getActiveList());
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.on("selectionUpdate", updateActiveList);
    editor.on("update", updateActiveList);
    return () => {
      editor.off("selectionUpdate", updateActiveList);
      editor.off("update", updateActiveList);
    };
  }, [editor, updateActiveList]);

  const item = useCallback(
    (icon: ReactNode, text: string, callback: () => void) => {
      return (
        <Button
          variant={"ghost"}
          className="px-1 pr-2 py-0 justify-start rounded-lg"
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
            "rounded-lg w-fit h-9 gap-1 px-2 text-foreground active:pushdown-98%",
            open && "bg-secondary/80",
          )}
        >
          {activeList ? listIcons[activeList] : <List />}
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 flex flex-col w-fit bg-view-2 text-foreground data-[state=closed]:animate-none!">
        {item(listIcons[ListType.Bullet], t("bulletList"), () =>
          editor?.chain().focus().toggleBulletList().run(),
        )}
        {item(listIcons[ListType.Task], t("toDoList"), () =>
          editor?.chain().focus().toggleTaskList().run(),
        )}
        {item(listIcons[ListType.Ordered], t("numberedList"), () =>
          editor?.chain().focus().toggleOrderedList().run(),
        )}
      </PopoverContent>
    </Popover>
  );
}
