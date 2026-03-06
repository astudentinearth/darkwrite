import { FontStyle } from "@/common/note-customization";
import { useNoteFromURL } from "@/features/note/hooks/use-note-from-url";
import { useEditorActions } from "./store/editor-actions";

export default function useStylePopover() {
  const noteId = useNoteFromURL();
  const { setEditorCustomizations } = useEditorActions();
  const setFont = (fontStyle: FontStyle, customFont?: string) => {
    if (!noteId) return;
    setEditorCustomizations(noteId, {
      font: fontStyle,
      ...(customFont && { customFont }),
    });
  };

  const setColor = (
    type: "backgroundColor" | "textColor",
    value: string | null,
  ) => {
    if (!noteId) return;
    setEditorCustomizations(noteId, {
      [type]: value,
    });
  };

  const setWide = (widePage: boolean) => {
    if (!noteId) return;
    setEditorCustomizations(noteId, { widePage });
  };

  return { setFont, setColor, setWide };
}
