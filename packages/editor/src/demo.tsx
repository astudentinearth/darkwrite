import "@darkwrite/ui/dist/styles.css";
import { useState } from "react";
import DarkwriteEditor from "./editor";
import { mockNotes } from "./editor/mocks";
import { EditorContent } from "./types";

export default function DemoApp() {
  const [content, setContent] = useState<EditorContent>({
    type: "doc",
    content: [],
  });
  return (
    <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-background p-4 drop-shadow-2xl">
      <div className="max-w-[960px] w-full max-h-[80vh] overflow-y-auto min-h-24 min-w-24 bg-view-1 rounded-xl border border-border p-2 pt-8 text-foreground">
        <DarkwriteEditor
          content={content}
          onContentChange={setContent}
          notes={mockNotes}
          onNavigateToNote={(id) => console.log(`navigating to ${id}`)}
        />
      </div>
    </div>
  );
}
