import type { SlashCommandItem as ISlashCommandItem } from "../../types";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui";
import type { Editor, Range } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import {
  type ForwardedRef,
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
      keywords={item.keywords}
      onSelect={() => {
        if (range && editor) item.command({ editor, range });
      }}
      value={`${item.title}`}
      className={cn(
        "hover:bg-secondary/40 hover:top-highlight data-[selected=true]:bg-secondary/40 data-[selected=true]:top-highlight rounded-lg flex items-center p-1",
      )}
    >
      <div
        className={cn(
          "bg-view-1/75 w-9 h-9 rounded-md border flex justify-center items-center shrink-0",
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
  // october 9th 2025: i have no idea what this does
  useImperativeHandle(ref, () => ({ ...containerRef.current!, onKeyDown }));

  return (
    <div
      ref={containerRef}
      className="max-h-[40vh] max-w-[600px] bg-view-2/80 backdrop-blur-lg top-highlight border rounded-xl drop-shadow-xl pl-1 pr-0 flex flex-col"
    >
      <Command
        className={
          "bg-transparent [&>div[data-slot=command-input-wrapper]]:hidden grow"
        }
        value={value}
        onValueChange={(val) => {
          setValue(val);
        }}
        filter={(val, search, keywords) => {
          const extended = val + " " + keywords?.join(" ");
          if (extended.toLocaleLowerCase().includes(search)) return 1;
          return 0;
        }}
      >
        <CommandInput
          className="hidden!"
          value={props.query.toLocaleLowerCase()}
        />
        <CommandEmpty className="px-2 text-muted-foreground/80 text-center py-2">
          No results
        </CommandEmpty>
        <CommandList
          ref={listRef}
          className="bg-transparent pb-1 pt-1 pr-1 command-view-container"
        >
          {props.items.map((i) => (
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
