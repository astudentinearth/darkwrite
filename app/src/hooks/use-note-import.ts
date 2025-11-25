import { DarkwriteAPIClient } from "@/api/api-client";
import { useEditorCommand } from "@/features/editor/use-editor-command";

export default function useNoteImport() {
  const commands = useEditorCommand();
  const importNotes = async () => {
    const result = await DarkwriteAPIClient.note.import();
    switch (result.type) {
      case "html": {
        const content = result.content.join("\n");
        commands.get()?.insertHTML(content);
        break;
      }
      case "json": {
        const json = result.content.map((c) => JSON.parse(c).contents);
        for (const item of json) {
          commands.get()?.insertJSON(item);
        }
        break;
      }
      case "md": {
        const markdown = result.content.join("\n");
        commands.get()?.insertMarkdown(markdown);
        break;
      }
    }
  };
  return { importNotes };
}
