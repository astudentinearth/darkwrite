import { csshighlightColorVariables } from "@/common/theme";
import {
  Button,
  ColorPicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDown, Eraser, Palette } from "lucide-react";
import { useState } from "react";
import { setCellBackground } from "./table-util";

export function TableBackgroundPicker() {
  const colorVars = csshighlightColorVariables;
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);
  const activeHighlightColor =
    editor?.getAttributes("tableHeader")?.background ||
    editor?.getAttributes("tableCell").background ||
    "";
  const [customColorValue, setCustomColorValue] =
    useState<string>(activeHighlightColor);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "rounded-lg w-fit gap-1 px-2 text-foreground h-9",
            open && "bg-secondary/80",
          )}
        >
          <Palette size={20} />
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
            onClick={() => {
              if (!editor) return;
              setCellBackground(editor, `var(${color})`);
            }}
          />
        ))}
        <Button
          variant={"outline"}
          className="w-8 h-8 hover:outline-2 hover:outline-primary p-0 justify-center items-center text-center"
          onClick={() => {
            if (!editor) return;
            setCellBackground(editor, null);
          }}
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
            setCustomColorValue(val);
            let payload = val;
            if (payload.length === 7) payload += "4D";
            if (!editor) return;
            setCellBackground(editor, payload);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
