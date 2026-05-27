import { cssTextColorVariables } from "@darkwrite/common";
import { useCurrentEditor } from "@tiptap/react";
import { Baseline, ChevronDown, Eraser } from "lucide-react";
import { useState } from "react";
import {
  Button,
  ColorPicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export function TextColorSelector() {
  const colorVars = cssTextColorVariables;
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const activeTextColor = editor?.getAttributes("textStyle")?.color || "";
  const [customColorValue, setCustomColorValue] =
    useState<string>(activeTextColor);
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
          <Baseline size={20} />
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid grid-cols-[2rem_2rem_2rem_2rem] grid-rows-3 gap-1 p-1 w-fit rounded-xl bg-view-2 text-foreground data-[state=closed]:animate-none!">
        {colorVars.map((color) => (
          <Button
            style={{ backgroundColor: `var(${color})` }}
            variant={"ghost"}
            className="w-8 h-8 outline-primary outline-2 outline-none hover:outline-solid hover:outline-2 hover:outline-primary"
            onClick={() =>
              editor?.chain().focus().setColor(`var(${color})`).run()
            }
          />
        ))}
        <Button
          variant={"outline"}
          className="w-8 h-8 outline-primary outline-2 outline-none hover:outline-solid hover:outline-2 hover:outline-primary "
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
          className="data-[state=closed]:animate-none! bg-secondary! outline-primary hover:outline-2 hover:outline-primary"
          onChange={(val) => {
            setCustomColorValue(val);
            editor?.chain().setColor(val).run();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
