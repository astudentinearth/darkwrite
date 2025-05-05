import { SlashCommandItem as ISlashCommandItem } from "@/types";
import { cn } from "@/utils";
import { Command, CommandInput, CommandItem, CommandList } from "@darkwrite/ui";
import { Editor, Range } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type SlashCommandViewProps = Omit<SuggestionProps, "items"> & {
  items: ISlashCommandItem[];
};

function SlashCommandItem({
  item,
  range,
  editor,
}: {
  item: ISlashCommandItem;
  editor: Editor | undefined | null;
  range: Range | undefined;
}) {
  return (
    <CommandItem
      onSelect={() => {
        if (range && editor) item.command({ editor, range });
      }}
      value={item.title}
      className={cn("hover:bg-secondary/20 rounded-[8px]")}
    >
      {item.title}
    </CommandItem>
  );
}

export const SlashCommandView = forwardRef(function (
  props: SlashCommandViewProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [value, setValue] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { editor } = useCurrentEditor();

  const onKeyDown = (p: SuggestionKeyDownProps) => {
    const { event } = p;
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") {
      listRef.current?.dispatchEvent(new KeyboardEvent("keydown", event));
      return true;
    }
    return false;
  };

  // this is disgusting
  useImperativeHandle(ref, () => ({ ...containerRef.current!, onKeyDown }));

  return (
    <div
      ref={containerRef}
      className="w-64 max-h-[40vh] bg-view-2 border rounded-xl drop-shadow-xl p-1"
    >
      <Command
        className={
          "bg-transparent [&>div[data-slot=command-input-wrapper]]:hidden"
        }
        value={value}
        onValueChange={(val)=>{
          console.log(val);
          setValue(val);
        }}
      >
        <CommandInput className="hidden!" value={props.query} />
        <CommandList ref={listRef} className="bg-transparent">
          {props.items
            .filter((i) =>
              i.title.toLowerCase().includes(props.query.toLocaleLowerCase()),
            )
            .map((i) => (
              <SlashCommandItem key={i.id} item={i} range={props.range} editor={editor}/>
            ))}
        </CommandList>
      </Command>
    </div>
  );
});
