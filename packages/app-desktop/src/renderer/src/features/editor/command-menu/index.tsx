import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandList,
  EditorCommandItem,
} from "novel";
import { suggestionItems } from "./slash-command";

export default function SlashCommand() {
  return (
    <EditorCommand className="z-50 h-auto max-h-[40vh] overflow-y-auto rounded-xl border border-muted bg-background px-1 py-1 shadow-md transition-all drop-shadow-xl">
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
  );
}
