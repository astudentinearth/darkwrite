import { cn } from "@/lib/utils";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Pipette } from "lucide-react";

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
            "p-0 w-8 h-8 rounded-lg border-border border",
            !props.value && "hover:bg-secondary/50! bg-secondary",
            props.className,
          )}
        >
          {!props.value && (
            <Pipette size={14} className="text-secondary-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 w-fit drop-shadow-xl overflow-hidden flex flex-col rounded-xl m-4 gap-1">
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
