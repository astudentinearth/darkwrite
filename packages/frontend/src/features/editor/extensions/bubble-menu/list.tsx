import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDown, List, ListOrdered, ListTodo } from "lucide-react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export function ListSelector() {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation(undefined, { keyPrefix: "editor.bubble" });
  const [open, setOpen] = useState(false);
  const item = (icon: ReactNode, text: string, callback: () => void) => {
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
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-lg w-fit h-9 gap-1 px-2 text-foreground",
            open && "bg-secondary/80",
          )}
        >
          <List />
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 flex flex-col w-fit rounded-xl bg-view-2 text-foreground data-[state=closed]:animate-none!">
        {item(<List />, t("bulletList"), () =>
          editor?.chain().focus().toggleBulletList().run(),
        )}
        {item(<ListTodo />, t("toDoList"), () =>
          editor?.chain().focus().toggleTaskList().run(),
        )}
        {item(<ListOrdered />, t("numberedList"), () =>
          editor?.chain().focus().toggleOrderedList().run(),
        )}
      </PopoverContent>
    </Popover>
  );
}
