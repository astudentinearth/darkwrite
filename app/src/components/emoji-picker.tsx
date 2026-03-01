import Picker from "@emoji-mart/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";
import "./emoji-picker.css";
import { hex } from "color-convert";
import { useAppearanceSettings } from "@/features/settings/store/settings-selectors";

export function EmojiPicker(props: {
  show?: string;
  onSelect?: (unified: string) => void;
  className?: string;
  closeOnSelect?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // convert our hex color to rgb to force on the picker
  const accent = useAppearanceSettings().accentColor;
  const rgb = hex.rgb(accent);
  const accentVar = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-20 h-20 text-6xl hover:bg-secondary/50",
            props.className,
          )}
        >
          {props.show}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ "--rgb-accent": accentVar } as CSSProperties}
        sticky="always"
        className="bg-view-2/80 p-0 rounded-xl top-highlight"
      >
        <Picker
          previewPosition="none"
          onEmojiSelect={(e: { unified: string }) => {
            props.onSelect?.call(null, e.unified);
            if (props.closeOnSelect) setOpen(false);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
