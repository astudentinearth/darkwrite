import { Popover, PopoverContent, PopoverTrigger, Switch } from "@darkwrite/ui";
import { HeaderbarButton } from "@/components/ui/headerbar-button";
import {
  setEditorCustomizations,
  useEditorState,
} from "@/context/editor-state";
import { useNoteFromURL } from "@/hooks/use-note-from-url";
import { cn } from "@/lib/utils";
import { Brush } from "lucide-react";
import ColorsView from "./colors";
import FontStyleView from "./font-style";

export function CustimzationSheet(props: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const activeNoteId = useNoteFromURL();
  const style = useEditorState((s) => s.customizations);
  const setWide = (state: boolean) =>
    setEditorCustomizations({ ...style, widePage: state });

  if (!activeNoteId) return <></>;
  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger asChild>
        <HeaderbarButton
          className={cn(props.open && "bg-secondary/80 opacity-100")}
        >
          <Brush size={18} />
        </HeaderbarButton>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 w-fit p-1 rounded-xl bg-popover/90 backdrop-blur-lg">
        <FontStyleView />
        <ColorsView />
        <div
          className="flex p-2 hover:bg-secondary/50 items-center rounded-lg"
          onClick={() => setWide(!style.widePage)}
        >
          <span className="grow select-none">Wide page</span>
          <Switch
            id="wide-page-switch"
            checked={style.widePage ?? false}
          ></Switch>
        </div>
      </PopoverContent>
    </Popover>
  );
}
