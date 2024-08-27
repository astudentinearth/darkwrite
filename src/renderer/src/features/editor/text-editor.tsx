import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { defaultExtensions } from "./extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import { FormattingButtons } from "./bubble-menu/formatting";
import { ScrollArea } from "@renderer/components/ui/scroll-area";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}
export const TextEditor = ({ initialValue, onChange }: EditorProp) => {
  return (
    <EditorRoot>
      <EditorContent
        className="p-0 rounded-xl w-full dark transition-transform"
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          onChange(editor.getJSON());
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-xl border border-muted bg-background px-1 py-1 shadow-md transition-all drop-shadow-xl">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-1 py-1 text-left text-sm hover:bg-secondary/50 aria-selected:bg-secondary/50 `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium select-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground select-none">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
            animation: "slide"
            
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded-xl border border-muted bg-background shadow-xl slide-in-from-top-1 transition-opacity"
        >
          <FormattingButtons/>
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
};
