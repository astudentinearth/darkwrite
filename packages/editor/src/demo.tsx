import "@darkwrite/ui/dist/styles.css";
import { useState } from "react";
import DarkwriteEditor from "./editor";
import { useSlashCommand } from "./editor/extensions/slash-command/builtin-command-items";
import { mockNotes } from "./editor/mocks";
import { EditorContent } from "./types";

export default function DemoApp() {
  const [content, setContent] = useState<EditorContent>({
    type: "doc",
    content: [],
  });
  const { items } = useSlashCommand();
  return (
    <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-background p-4 drop-shadow-2xl">
      <div className="bg-view-1 rounded-xl border border-border flex w-full h-full">
        <div className="h-full w-1/2 shrink-0 overflow-y-auto min-h-24 min-w-24  p-2 pt-8 text-foreground">
          <DarkwriteEditor
            content={content}
            onContentChange={setContent}
            notes={mockNotes}
            commandItems={items}
            codeBlockIndentSize={2}
            onNavigateToNote={(id) => console.log(`navigating to ${id}`)}
          />
        </div>
        <div className="shrink-0 w-1/2 border-l border-l-border p-2">
          {JSON.stringify(content)}
        </div>
      </div>
    </div>
  );
}
