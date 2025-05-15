import "@darkwrite/ui/dist/styles.css";
import { useState } from "react";
import DarkwriteEditor from "./editor";
import { useSlashCommand } from "./editor/extensions/slash-command/builtin-command-items";
import { mockNotes } from "./editor/mocks";
import { EditorContent } from "./types";
import { Editor } from "@tiptap/core";
import { Button } from "@darkwrite/ui";
import EditorUtil from "./editor/editor-util";
import { MockEmbedContext } from "./mock-embed-context";
import { ImageExtensionConfig } from "./editor/extensions/image/image-config";
import { nanoid } from "nanoid";

export default function DemoApp() {
  const [content, setContent] = useState<EditorContent>({
    type: "doc",
    content: [],
  });
  const [instance, setInstance] = useState<Editor | null>(null);
  const [embeds, setEmbeds] = useState<{ [key: string]: string }>({});
  const util = instance ? new EditorUtil(instance) : null;
  const { items } = useSlashCommand();

  const config: ImageExtensionConfig = {
    uploadFile: async (file) => {
      const id = nanoid();
      const newState = { ...embeds };
      const reader = new FileReader();
      const url = reader.readAsDataURL(file);
      Object.defineProperty(newState, id, {
        writable: true,
        configurable: true,
        enumerable: true,
        value: url,
      });
      setEmbeds(newState);
      return id;
    },
    async saveArrayBuffer(buffer) {
      const id = nanoid();
      const newState = { ...embeds };
      const reader = new FileReader();
      const url = reader.readAsDataURL(new Blob([buffer]));
      Object.defineProperty(newState, id, {
        writable: true,
        configurable: true,
        enumerable: true,
        value: url,
      });
      setEmbeds(newState);
      return id;
    },
  };

  const embedResolver = async (id: string) => embeds[id];

  return (
    <MockEmbedContext.Provider value={{ embeds }}>
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
              onInstanceChange={setInstance}
              imageUploadConfig={config}
              embedSourceResolver={embedResolver}
            />
          </div>
          <div className="shrink-0 w-1/2 border-l border-l-border [&>button]:mr-2 p-2 overflow-y-auto json-view">
            <Button
              variant={"outline"}
              onClick={() => console.log(util?.getHeadings())}
            >
              log headings
            </Button>
            <Button
              variant={"outline"}
              onClick={() => console.log(util?.getTodos())}
            >
              log todos
            </Button>
            <Button
              variant={"outline"}
              onClick={() => console.log(util?.insertParagraphBelow())}
            >
              insert below
            </Button>
            <Button
              variant={"outline"}
              onClick={() => console.log(util?.insertParagraphAbove())}
            >
              insert above
            </Button>
            <br />
            {JSON.stringify(content)}
          </div>
        </div>
      </div>
    </MockEmbedContext.Provider>
  );
}
