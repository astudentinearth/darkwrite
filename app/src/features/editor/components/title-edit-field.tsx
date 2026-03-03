import { cleanNoteTitle } from "@/common/note";
import DynamicTextarea from "@/components/dynamic-textarea";
import { EditorContext } from "@/features/editor/store/editor-context";
import { selectNoteTitle } from "@/features/note/store/note-selectors";
import { createTitleUpdater } from "@/features/note/store/update-note";
import { useAppSelector } from "@/features/store/hooks";
import { use, useMemo } from "react";
import { emitEditorEvent } from "../event/editor-bus";
import { EditorEventType } from "../event/types";
import { UtilityNodes } from "../node-types";

export function TitleEditField() {
  const { noteId } = use(EditorContext);
  const titleUpdater = useMemo(() => createTitleUpdater(noteId), [noteId]);
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));

  return (
    <DynamicTextarea
      className="text-4xl font-semibold box-border h-auto overflow-hidden resize-none grow outline-hidden block"
      defaultValue={title}
      preventNewline
      autoFocus
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          emitEditorEvent({
            noteId,
            type: EditorEventType.INSERT_CONTENT,
            payload: {
              position: 0,
              content: UtilityNodes.EmptyParagraph,
            },
          });
          emitEditorEvent({ noteId, type: EditorEventType.FOCUS });
        }
      }}
      onValueChange={(val) => titleUpdater.update(cleanNoteTitle(val))}
    />
  );
}
