import useEditorCover from "@/hooks/editor/use-editor-cover";
import { useNoteById } from "@/query/use-note-by-id";
import { useNoteFromURL } from "@/query/use-note-from-url";
import EditorHeader from "./header";
import { useNoteContent, useUpdateNoteContent } from "@/query/use-note-content";
import { CSSProperties, useEffect } from "react";
import { FONT_VARS, FontStyle } from "@/common/note-customization";
import DarkwriteEditor from ".";
import { useSlashCommand } from "./extensions";
import { useEditorOptions } from "@/hooks/editor/use-editor-options";
import { produce } from "immer";
import { DarkwriteAPIClient } from "@/api/api-client";
import { useNotes } from "@/query/use-notes";
import ConstrainedWidth from "./constrained-width";
import { setActiveEditorInstance } from "@/context/editor-store";

export function EditorViewRouteHandler() {
  const noteId = useNoteFromURL();
  const { note } = useNoteById(noteId ?? "");
  if (!noteId) return "Not found";
  if (!note) return null;
  return <EditorView key={`editor-root-${noteId}`} noteId={noteId} />;
}

export function EditorView({ noteId }: { noteId: string }) {
  const { note } = useNoteById(noteId);
  const notes = useNotes().notes;
  const options = useEditorOptions();
  const content = useNoteContent(noteId).data;
  const { mutate } = useUpdateNoteContent(noteId);
  const cover = useEditorCover(noteId);
  const { items } = useSlashCommand(options.imageConfig);
  const style: CSSProperties = {};
  if (content) {
    style.fontFamily =
      content.customizations.font === FontStyle.CUSTOM
        ? (content.customizations.customFont ?? `var(${FONT_VARS.custom})`)
        : content.customizations.font
          ? `var(${FONT_VARS[content.customizations.font]})`
          : `var(${FONT_VARS.sans})`;

    if (content.customizations.backgroundColor)
      style.background = content.customizations.backgroundColor;
    if (content.customizations.textColor) {
      style.color = content.customizations.textColor;
      //@ts-expect-error assigning CSS variable to React.CSSProperties
      style["--dw-editor-foreground"] = content.customizations.textColor;
    }
  }
  return (
    <div
      data-editor-boundary="true"
      className="flex items-center flex-col px-24 editor-fade-in min-h-full relative"
      style={style}
    >
      {note && (
        <EditorHeader
          icon={note.icon}
          title={note.title}
          onTitleChange={cover.updateTitle}
          onIconChange={cover.updateIcon}
          coverImageSource={content?.customizations.coverImageSource}
          onCoverSourceChange={cover.onCoverImageSourceChange}
          wide={content?.customizations.widePage}
          onAddCover={cover.addCover}
        />
      )}
      <ConstrainedWidth fill={content?.customizations.widePage}>
        {content && (
          <DarkwriteEditor
            content={content.contents || ""}
            commandItems={items}
            onContentChange={(value) =>
              mutate({
                content: produce(content, (draft) => {
                  draft.contents = value;
                }),
                debounce: true,
              })
            }
            imageUploadConfig={options.imageConfig}
            codeBlockIndentSize={options.indentSize}
            embedSourceResolver={async (id) =>
              (await DarkwriteAPIClient.embed.getById(id)).embed?.url ?? ""
            }
            key={noteId}
            notes={Object.values(notes ?? {})}
            onInstanceChange={setActiveEditorInstance}
          />
        )}
      </ConstrainedWidth>
    </div>
  );
}
