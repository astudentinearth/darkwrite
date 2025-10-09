import { cn } from "@/lib/utils";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ColorPicker,
} from "@/components/ui";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDown, Eraser, Highlighter } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { csshighlightColorVariables } from "@/common/theme";

export function HighlightColorSelector(props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const colorVars = csshighlightColorVariables;
  const { editor } = useCurrentEditor();
  const activeHighlightColor = editor?.getAttributes("highlight")?.color || "";
  const [customColorValue, setCustomColorValue] =
    useState<string>(activeHighlightColor);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-lg w-fit gap-1 px-2 text-foreground h-9",
            props.open && "bg-secondary/80",
          )}
        >
          <Highlighter size={20} />
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-[2rem_2rem_2rem_2rem] grid-rows-3 gap-1 p-1 w-fit rounded-xl bg-view-2 text-foreground data-[state=closed]:animate-none!">
        {colorVars.map((color) => (
          <Button
            style={{ backgroundColor: `var(${color})` }}
            variant={"ghost"}
            key={color}
            className="w-8 h-8 hover:outline-2 hover:outline-primary"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .setHighlight({ color: `var(${color})` })
                .run()
            }
          />
        ))}
        <Button
          variant={"outline"}
          className="w-8 h-8 hover:outline-2 hover:outline-primary p-0 justify-center items-center text-center"
          onClick={() => editor?.chain().focus().unsetHighlight().run()}
        >
          <Eraser
            size={18}
            className="text-center flex justify-center items-center"
          />
        </Button>
        <ColorPicker
          defaultValue={activeHighlightColor}
          value={customColorValue}
          className="data-[state=closed]:animate-none! bg-secondary! hover:outline-2 hover:outline-primary"
          onChange={(val) => {
            console.log(val);
            if (val.length === 7) val += "4D";
            setCustomColorValue(val);
            editor?.chain().setHighlight({ color: val }).run();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
