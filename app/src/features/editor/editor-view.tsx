import useEditorCover from "@/hooks/editor/use-editor-cover";
import { useNoteById } from "@/query/use-note-by-id";
import { useNoteFromURL } from "@/query/use-note-from-url";
import EditorHeader from "./header";
import { useNoteContent } from "@/query/use-note-content";
import { CSSProperties } from "react";
import { FONT_VARS, FontStyle } from "@/common/note-customization";

export function EditorViewRouteHandler() {
  const noteId = useNoteFromURL();
  if (!noteId) return "Not found";
  return <EditorView key={`editor-root-${noteId}`} noteId={noteId} />;
}

export function EditorView({ noteId }: { noteId: string }) {
  const { note } = useNoteById(noteId);
  const content = useNoteContent(noteId).data;
  const cover = useEditorCover(noteId);
  const style: CSSProperties = {};
  if (content) {
    style.fontFamily =
      content.customizations.font === FontStyle.CUSTOM
        ? (content.customizations.customFont ?? `var(${FONT_VARS.custom})`)
        : content.customizations.font
          ? `var(${FONT_VARS[content.customizations.font]})`
          : `var(${FONT_VARS.sans})`;

    if(content.customizations.backgroundColor) style.background = content.customizations.backgroundColor;
    if(content.customizations.textColor) style.color = content.customizations.textColor;
  }
  return (
    <div className="flex justify-center h-full" style={style}>
      {note && (
        <EditorHeader
          icon={note.icon}
          title={note.title}
          onTitleChange={cover.updateTitle}
          onIconChange={() => { }}
          coverImageSource=""
          onCoverSourceChange={() => { }}
        />
      )}
    </div>
  );
}
