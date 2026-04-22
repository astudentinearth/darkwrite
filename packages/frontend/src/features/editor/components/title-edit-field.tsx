import { cleanNoteTitle } from "@darkwrite/common";
import DynamicTextarea from "@/components/dynamic-textarea";
import { EditorContext } from "@/features/editor/store/editor-context";
import { selectNoteTitle } from "@/features/note/store/note-selectors";
import { useTitleUpdater } from "@/features/note/store/update-note";
import { useAppSelector } from "@/features/store/hooks";
import { use } from "react";
import { emitEditorEvent } from "../event/editor-bus";
import { EditorEventType } from "../event/types";
import { UtilityNodes } from "../node-types";
import { useTranslation } from "react-i18next";

export function TitleEditField() {
  const { noteId } = use(EditorContext);
  const titleUpdater = useTitleUpdater(noteId);
  const title = useAppSelector((s) => selectNoteTitle(s, noteId));
  const { t } = useTranslation();

  return (
    <DynamicTextarea
      className="text-4xl font-semibold box-border h-auto overflow-hidden resize-none grow outline-hidden block"
      defaultValue={title}
      preventNewline
      placeholder={t("defaults.pageTitle")}
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
