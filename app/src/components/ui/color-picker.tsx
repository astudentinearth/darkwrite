import { HexColorInput, HexColorPicker } from "react-colorful";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

export type ColorPickerProps = {
  onChange?: (val: string) => void;
  value?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
};

export function ColorPicker(props: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          style={{
            background: `${props.value || "var(--secondary)"}`,
          }}
          disabled={props.disabled}
          className={cn(
            "p-0 w-8 h-8 rounded-md border-border border",
            !props.value && "hover:bg-secondary/50! bg-secondary",
            props.className,
          )}
        >
          <Pipette size={14} className="text-secondary-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-fit drop-shadow-xl overflow-hidden flex flex-col rounded-xl m-2 gap-1">
        <HexColorPicker
          color={props.value}
          onChange={props.onChange}
          defaultValue={props.defaultValue}
          className=""
        />
        <HexColorInput
          className="bg-view-2 p-2 rounded-lg w-[200px]"
          color={props.value}
          onChange={props.onChange}
          defaultValue={props.defaultValue}
        />
      </PopoverContent>
    </Popover>
  );
}
