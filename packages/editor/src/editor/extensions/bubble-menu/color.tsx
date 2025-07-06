import { cn } from "@/utils";
import { cssTextColorVariables } from "@darkwrite/common";
import {
  Button,
  ColorPicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@darkwrite/ui";
import { useCurrentEditor } from "@tiptap/react";
import { Baseline, ChevronDown, Eraser } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export function TextColorSelector(props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const colorVars = cssTextColorVariables;
  const { editor } = useCurrentEditor();
  const activeTextColor = editor?.getAttributes("textStyle")?.color || "";
  const [customColorValue, setCustomColorValue] =
    useState<string>(activeTextColor);
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
          <Baseline size={20} />
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-[2rem_2rem_2rem_2rem] grid-rows-3 gap-1 p-1 w-fit rounded-xl bg-view-2 text-foreground data-[state=closed]:animate-none!">
        {colorVars.map((color) => (
          <Button
            style={{ backgroundColor: `var(${color})` }}
            variant={"ghost"}
            className="w-8 h-8 hover:outline-2 hover:outline-primary"
            onClick={() =>
              editor?.chain().focus().setColor(`var(${color})`).run()
            }
          />
        ))}
        <Button
          variant={"outline"}
          className="w-8 h-8 hover:outline-2 hover:outline-primary p-0 justify-center items-center text-center"
          onClick={() => editor?.chain().focus().unsetColor().run()}
        >
          <Eraser
            size={18}
            className="text-center flex justify-center items-center"
          />
        </Button>
        <ColorPicker
          defaultValue={activeTextColor}
          value={customColorValue}
          className="data-[state=closed]:animate-none! bg-secondary! hover:outline-2 hover:outline-primary"
          onChange={(val) => {
            console.log(val);
            setCustomColorValue(val);
            editor?.chain().setColor(val).run();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
