import { DarkwriteAPIClient } from "./api/api-client";
import DarkwriteEditor from "./features/editor";
import { useSlashCommand } from "./features/editor/extensions";

export default function EditorDebugPage() {
  const { items } = useSlashCommand();
  return (
    <DarkwriteEditor
      codeBlockIndentSize={2}
      commandItems={items}
      content={{}}
      imageUploadConfig={{ saveArrayBuffer: () => {}, uploadFile: () => {} }}
      embedSourceResolver={() => {}}
      onContentChange={() => {}}
      notes={[]}
    ></DarkwriteEditor>
  );
}
