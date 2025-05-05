import { SlashCommandItem as ISlashCommandItem } from "@/types";
import { cn } from "@/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@darkwrite/ui";
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
      className={cn(
        "hover:bg-secondary/80 rounded-[8px] flex items-center p-1",
      )}
    >
      <div
        className={cn(
          "bg-view-2 w-9 h-9 rounded-md border flex justify-center items-center",
        )}
      >
        {item.icon}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">{item.title}</span>
        <span className="text-xs text-foreground/70">{item.description}</span>
      </div>
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
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter"
    ) {
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
      className="w-64 max-h-[40vh] bg-popover border rounded-xl drop-shadow-xl pt-1 px-1"
    >
      <Command
        className={
          "bg-transparent [&>div[data-slot=command-input-wrapper]]:hidden"
        }
        value={value}
        onValueChange={(val) => {
          console.log(val);
          setValue(val);
        }}
      >
        <CommandInput className="hidden!" value={props.query} />
        <CommandEmpty className="px-2 text-muted-foreground/80 text-center py-2">
          No results
        </CommandEmpty>
        <CommandList ref={listRef} className="bg-transparent pb-1">
          {props.items
            .filter((i) =>
              i.title.toLowerCase().includes(props.query.toLocaleLowerCase()),
            )
            .map((i) => (
              <SlashCommandItem
                key={i.id}
                item={i}
                range={props.range}
                editor={editor}
              />
            ))}
        </CommandList>
      </Command>
    </div>
  );
});
