import { DarkwriteAPIClient } from "@/api/api-client";
import { emitEditorEvent } from "@/features/editor/event/editor-bus";
import { EditorEventType } from "@/features/editor/event/types";

export default function useNoteImport(noteId: string, instanceId: string) {
  const importNotes = async () => {
    const apiResult = await DarkwriteAPIClient.note.import();
    if (apiResult.isErr()) return;
    const result = apiResult.value;
    switch (result.type) {
      case "html": {
        const content = result.content.join("\n");
        emitEditorEvent({
          noteId,
          type: EditorEventType.INSERT_CONTENT,
          payload: { type: "html", content },
          targetInstanceId: instanceId,
        });
        break;
      }
      case "json": {
        const json = result.content.map((c) => JSON.parse(c).contents);
        for (const item of json) {
          emitEditorEvent({
            noteId,
            type: EditorEventType.INSERT_CONTENT,
            payload: { type: "json", content: item },
            targetInstanceId: instanceId,
          });
        }
        break;
      }
      case "md": {
        const markdown = result.content.join("\n");
        emitEditorEvent({
          noteId,
          type: EditorEventType.INSERT_CONTENT,
          payload: { type: "md", content: markdown },
          targetInstanceId: instanceId,
        });
        break;
      }
    }
  };
  return { importNotes };
}
